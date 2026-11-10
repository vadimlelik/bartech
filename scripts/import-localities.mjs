import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import {
  localityWriteData,
  planLocalityImport,
  resolvePlaceParents,
} from '../src/entities/locality/lib/import-plan.js';
import {
  BOUNDARIES_QUERY,
  PLACES_QUERY,
  indexBoundaries,
  placeFromElement,
  readOverpassElements,
} from '../src/entities/locality/lib/osm.js';

const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
const WRITE_CHUNK = 100;

function parseArgs(argv) {
  const args = { dryRun: false, file: '', places: '', boundaries: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--dry-run') args.dryRun = true;
    else if (token === '--file') args.file = argv[++index] || '';
    else if (token === '--places') args.places = argv[++index] || '';
    else if (token === '--boundaries') args.boundaries = argv[++index] || '';
    else throw new Error(`Неизвестный аргумент: ${token}`);
  }
  return args;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function overpass(query) {
  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'technobar-locality-import/1.0',
    },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(240_000),
  });
  if (!response.ok) {
    throw new Error(`Overpass ответил ${response.status}`);
  }
  const payload = await response.json();
  if (payload.remark && !Array.isArray(payload.elements)) {
    throw new Error(payload.remark);
  }
  return payload;
}

async function loadSources(args) {
  if (args.file) {
    const payload = await readJson(args.file);
    const elements = readOverpassElements(payload);
    return {
      places: elements.filter((element) => element.tags?.place),
      boundaries: elements.filter((element) => element.tags?.boundary === 'administrative'),
    };
  }
  const placesPayload = args.places ? await readJson(args.places) : await overpass(PLACES_QUERY);
  const boundariesPayload = args.boundaries
    ? await readJson(args.boundaries)
    : await overpass(BOUNDARIES_QUERY);
  return {
    places: readOverpassElements(placesPayload),
    boundaries: readOverpassElements(boundariesPayload),
  };
}

async function ensureRegion(prisma, cache, name, dryRun) {
  if (cache.has(name)) return cache.get(name);
  if (dryRun) {
    const row = await prisma.geoRegion.findUnique({ where: { name } });
    cache.set(name, row?.id ?? null);
    return row?.id ?? null;
  }
  const row = await prisma.geoRegion.upsert({
    where: { name },
    create: { name },
    update: {},
  });
  cache.set(name, row.id);
  return row.id;
}

async function ensureDistrict(prisma, cache, regionId, regionName, name, dryRun) {
  const key = `${regionName}:${name}`;
  if (cache.has(key)) return cache.get(key);
  if (dryRun || !regionId) {
    const row = regionId
      ? await prisma.geoDistrict.findUnique({ where: { regionId_name: { regionId, name } } })
      : null;
    const id = row?.id ?? -(cache.size + 1);
    cache.set(key, id);
    return id;
  }
  const row = await prisma.geoDistrict.upsert({
    where: { regionId_name: { regionId, name } },
    create: { regionId, name },
    update: {},
  });
  cache.set(key, row.id);
  return row.id;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log(args.dryRun ? 'Пробный прогон, база не изменится.' : 'Импорт населённых пунктов из OSM.');
  const { places, boundaries } = await loadSources(args);
  const index = indexBoundaries(boundaries);
  console.log(`Границы: областей ${index.regions.length}, районов ${index.districts.length}.`);

  const prisma = new PrismaClient();
  const regionIds = new Map();
  const districtIds = new Map();
  const incoming = [];

  try {
    for (const element of places) {
      const place = placeFromElement(element);
      if (!place) continue;
      const parents = resolvePlaceParents(place, index);
      if (!parents) {
        incoming.push(place);
        continue;
      }
      const regionId = await ensureRegion(prisma, regionIds, parents.regionName, args.dryRun);
      const districtId = await ensureDistrict(
        prisma,
        districtIds,
        regionId,
        parents.regionName,
        parents.districtName,
        args.dryRun,
      );
      incoming.push({ ...place, districtId });
    }

    const existingRows = await prisma.locality.findMany({
      where: { osmId: { not: null } },
      select: {
        osmId: true,
        slug: true,
        name: true,
        type: true,
        districtId: true,
        latitude: true,
        longitude: true,
        population: true,
        isPopular: true,
        isActive: true,
        serviceCitySlug: true,
      },
    });
    const existingByOsmId = new Map(existingRows.map((row) => [String(row.osmId), row]));
    const plan = planLocalityImport(existingByOsmId, incoming);

    if (!args.dryRun) {
      for (let offset = 0; offset < plan.operations.length; offset += WRITE_CHUNK) {
        const chunk = plan.operations.slice(offset, offset + WRITE_CHUNK);
        await prisma.$transaction(
          chunk.map((operation) => {
            const data = localityWriteData(operation);
            if (operation.action === 'insert') {
              return prisma.locality.create({ data });
            }
            return prisma.locality.update({
              where: { osmId: operation.osmId },
              data,
            });
          }),
        );
      }
    }

    const { added, updated, unchanged, skipped } = plan.stats;
    console.log(`Добавлено: ${added}. Обновлено: ${updated}. Без изменений: ${unchanged}. Пропущено: ${skipped}.`);
    await finishImportJob(plan.stats);
    if (plan.skipSamples.length) {
      console.log('Примеры пропусков:');
      for (const sample of plan.skipSamples) console.log(`- ${sample}`);
    }
  } finally {
    if (prisma) await prisma.$disconnect();
  }
}

async function finishImportJob(stats, error) {
  const jobId = Number(process.env.LOCALITY_IMPORT_JOB_ID);
  if (!jobId) return;
  const client = new PrismaClient();
  try {
    await client.localityImportRun.update({
      where: { id: jobId },
      data: error
        ? {
            status: 'failed',
            error: String(error instanceof Error ? error.message : error).slice(0, 500),
            finishedAt: new Date(),
          }
        : {
            status: 'succeeded',
            added: stats.added || 0,
            updated: stats.updated || 0,
            unchanged: stats.unchanged || 0,
            skipped: stats.skipped || 0,
            finishedAt: new Date(),
          },
    });
  } finally {
    await client.$disconnect();
  }
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await finishImportJob(null, error).catch(() => {});
  process.exit(1);
});
