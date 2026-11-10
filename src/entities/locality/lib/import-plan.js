import { normalizeLocalityName, normalizeWhitespace, uniqueLocalitySlug } from './normalize.js';
import { locateLocality } from './geo.js';

const SKIP_SAMPLE_LIMIT = 20;

export const POPULAR_LOCALITY_NAMES = [
  'Минск',
  'Брест',
  'Гомель',
  'Гродно',
  'Витебск',
  'Могилёв',
  'Бобруйск',
  'Барановичи',
  'Борисов',
  'Пинск',
];

function osmKey(osmId) {
  return osmId == null ? '' : String(osmId);
}

function rememberSkip(stats, samples, reason) {
  stats.skipped += 1;
  if (samples.length < SKIP_SAMPLE_LIMIT) samples.push(reason);
}

function sameValue(left, right) {
  if (left == null && right == null) return true;
  return left === right;
}

export function resolvePlaceParents(place, index) {
  const located = locateLocality(place.latitude, place.longitude, index);
  if (located) return located;
  if (place.regionHint && place.districtHint) {
    return { regionName: place.regionHint, districtName: place.districtHint };
  }
  return null;
}

export function planLocalityImport(existingByOsmId, incoming) {
  const stats = { added: 0, updated: 0, unchanged: 0, skipped: 0 };
  const skipSamples = [];
  const operations = [];
  const usedSlugs = new Set();
  const seen = new Set();

  for (const row of existingByOsmId.values()) {
    if (row.slug) usedSlugs.add(row.slug);
  }

  for (const place of incoming) {
    const name = normalizeWhitespace(place.name);
    const key = osmKey(place.osmId);
    if (!name) {
      rememberSkip(stats, skipSamples, 'нет названия');
      continue;
    }
    if (!key || seen.has(key)) {
      rememberSkip(stats, skipSamples, `${name}: нет osm_id или повтор в файле`);
      continue;
    }
    if (!place.type || !place.districtId) {
      rememberSkip(stats, skipSamples, `${name}: нет типа или района`);
      continue;
    }
    if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) {
      rememberSkip(stats, skipSamples, `${name}: нет координат`);
      continue;
    }
    seen.add(key);

    const next = {
      name,
      nameNorm: normalizeLocalityName(name),
      type: place.type,
      districtId: place.districtId,
      latitude: place.latitude,
      longitude: place.longitude,
      population: place.population ?? null,
    };
    const existing = existingByOsmId.get(key);
    if (!existing) {
      const data = {
        ...next,
        slug: uniqueLocalitySlug(name, usedSlugs, place.osmId),
        osmId: place.osmId,
        isPopular: false,
        isActive: true,
        serviceCitySlug: null,
      };
      operations.push({ action: 'insert', osmId: place.osmId, data });
      stats.added += 1;
      continue;
    }

    const changed = !sameValue(existing.name, next.name)
      || !sameValue(existing.type, next.type)
      || !sameValue(existing.districtId, next.districtId)
      || !sameValue(existing.latitude, next.latitude)
      || !sameValue(existing.longitude, next.longitude)
      || !sameValue(existing.population, next.population);
    if (!changed) {
      stats.unchanged += 1;
      continue;
    }
    operations.push({
      action: 'update',
      osmId: place.osmId,
      data: next,
      preserved: {
        isPopular: existing.isPopular,
        isActive: existing.isActive,
        serviceCitySlug: existing.serviceCitySlug ?? null,
        slug: existing.slug,
      },
    });
    stats.updated += 1;
  }

  return { stats, operations, skipSamples };
}

export function localityWriteData(operation) {
  const source = operation.data;
  return {
    name: source.name,
    nameNorm: source.nameNorm,
    type: source.type,
    districtId: source.districtId,
    latitude: source.latitude,
    longitude: source.longitude,
    population: source.population,
    ...(operation.action === 'insert'
      ? {
          slug: source.slug,
          osmId: source.osmId,
          isPopular: false,
          isActive: true,
          serviceCitySlug: null,
        }
      : {}),
  };
}

export function pickPopularLocalities(rows) {
  const picks = [];
  const missing = [];
  for (const name of POPULAR_LOCALITY_NAMES) {
    const key = normalizeLocalityName(name);
    const matches = rows.filter((row) => row.nameNorm === key);
    const cities = matches.filter((row) => row.type === 'г.');
    const pool = (cities.length ? cities : matches).slice();
    pool.sort((left, right) => (right.population || 0) - (left.population || 0) || left.id - right.id);
    if (!pool[0]) {
      missing.push(name);
      continue;
    }
    picks.push(pool[0]);
  }
  return { picks, missing };
}
