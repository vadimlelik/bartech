import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLocalityName, normalizeWhitespace } from './lib/normalize.js';
import { containsPoint, locateLocality } from './lib/geo.js';
import {
  boundaryFromRelation,
  encodeOsmId,
  indexBoundaries,
  localityType,
  placeFromElement,
} from './lib/osm.js';
import {
  localityWriteData,
  pickPopularLocalities,
  planLocalityImport,
} from './lib/import-plan.js';

const SQUARE = [
  { lat: 55, lon: 27 },
  { lat: 56, lon: 27 },
  { lat: 56, lon: 28 },
  { lat: 55, lon: 28 },
  { lat: 55, lon: 27 },
];

function boundary(name, level, ring) {
  return {
    type: 'relation',
    id: name.length,
    tags: { boundary: 'administrative', admin_level: level, 'name:ru': name },
    members: [{ type: 'way', role: 'outer', geometry: ring }],
  };
}

const region = boundary('Витебская область', '4', SQUARE);
const district = boundary('Браславский район', '6', SQUARE);

function adamovo(overrides = {}) {
  return {
    osmId: 100n,
    name: '  Адамово  ',
    type: 'д.',
    districtId: 7,
    latitude: 55.4,
    longitude: 27.4,
    population: 120,
    ...overrides,
  };
}

test('название берётся из name:ru, пробелы схлопываются, пустое пропускается', () => {
  const place = placeFromElement({
    type: 'node',
    id: 42,
    lat: 55.1,
    lon: 27.2,
    tags: { place: 'village', 'name:ru': '  Ёдки   ', name: 'Yodki', official_status: 'агрогородок' },
  });
  assert.equal(place.name, 'Ёдки');
  assert.equal(normalizeLocalityName(place.name), 'едки');
  assert.equal(place.type, 'аг.');
  assert.equal(encodeOsmId('way', 42), -42n);
  assert.equal(localityType({ place: 'hamlet' }), 'х.');
  assert.equal(normalizeWhitespace('  д.   Адамово '), 'д. Адамово');

  const skipped = planLocalityImport(new Map(), [
    { osmId: 1n, name: '   ', type: 'д.', districtId: 1, latitude: 1, longitude: 1 },
  ]);
  assert.equal(skipped.stats.skipped, 1);
  assert.equal(skipped.stats.added, 0);
});

test('точка попадает в область и район', () => {
  const parsed = boundaryFromRelation(district);
  assert.equal(containsPoint(55.4, 27.4, parsed), true);
  assert.equal(containsPoint(50, 20, parsed), false);
  const located = locateLocality(55.4, 27.4, indexBoundaries([region, district]));
  assert.deepEqual(located, {
    regionName: 'Витебская область',
    districtName: 'Браславский район',
  });
  const minsk = boundary('Минск', '4', SQUARE);
  assert.deepEqual(locateLocality(55.4, 27.4, indexBoundaries([minsk])), {
    regionName: 'Минск',
    districtName: 'Минск',
  });
});

test('повторный импорт не создаёт дубль и не затирает ручные поля', () => {
  const first = planLocalityImport(new Map(), [adamovo()]);
  assert.equal(first.stats.added, 1);
  assert.equal(first.operations[0].data.name, 'Адамово');
  assert.equal(first.operations[0].data.nameNorm, 'адамово');
  assert.equal(first.operations[0].data.isPopular, false);
  const written = localityWriteData(first.operations[0]);
  assert.equal(written.isActive, true);
  assert.equal(written.serviceCitySlug, null);

  const existing = new Map([
    [String(adamovo().osmId), {
      osmId: adamovo().osmId,
      slug: first.operations[0].data.slug,
      name: 'Адамово',
      type: 'д.',
      districtId: 7,
      latitude: 55.4,
      longitude: 27.4,
      population: 120,
      isPopular: true,
      isActive: false,
      serviceCitySlug: 'vitebsk',
    }],
  ]);

  const second = planLocalityImport(existing, [adamovo()]);
  assert.equal(second.stats.added, 0);
  assert.equal(second.stats.updated, 0);
  assert.equal(second.stats.unchanged, 1);
  assert.equal(second.operations.length, 0);

  const renamed = planLocalityImport(existing, [adamovo({ name: 'Ёдамово', population: 130 })]);
  assert.equal(renamed.stats.updated, 1);
  assert.equal(renamed.stats.added, 0);
  const update = localityWriteData(renamed.operations[0]);
  assert.equal(update.name, 'Ёдамово');
  assert.equal(update.nameNorm, 'едамово');
  assert.equal(update.population, 130);
  assert.equal(Object.hasOwn(update, 'isPopular'), false);
  assert.equal(Object.hasOwn(update, 'isActive'), false);
  assert.equal(Object.hasOwn(update, 'serviceCitySlug'), false);
  assert.equal(Object.hasOwn(update, 'slug'), false);
  assert.equal(renamed.operations[0].preserved.isPopular, true);
  assert.equal(renamed.operations[0].preserved.isActive, false);
  assert.equal(renamed.operations[0].preserved.serviceCitySlug, 'vitebsk');
  assert.equal(renamed.operations[0].preserved.slug, 'adamovo');
});

test('популярные города выбираются по нормализованному имени, тип г. важнее деревни', () => {
  const rows = [
    { id: 1, name: 'Брест', nameNorm: 'брест', type: 'д.', population: 9000, isPopular: false },
    { id: 2, name: 'Брест', nameNorm: 'брест', type: 'г.', population: 340000, isPopular: false },
    { id: 3, name: 'Могилёв', nameNorm: 'могилев', type: 'г.', population: 350000, isPopular: true },
  ];
  const { picks, missing } = pickPopularLocalities(rows);
  const brest = picks.find((row) => row.nameNorm === 'брест');
  const mogilev = picks.find((row) => row.nameNorm === 'могилев');
  assert.equal(brest.id, 2);
  assert.equal(mogilev.id, 3);
  assert.equal(missing.includes('Минск'), true);
  assert.equal(missing.includes('Могилёв'), false);
});
