import { normalizeWhitespace } from './normalize.js';
import { assembleRings, bboxOf } from './geo.js';

const PLACE_TAGS = new Set(['city', 'town', 'village', 'hamlet']);

const STATUS_TYPES = [
  [/агрогородок/i, 'аг.'],
  [/городской пос[её]лок|гарадск[іи] пас[её]лак/i, 'г.п.'],
  [/курортн/i, 'к.п.'],
  [/рабочий пос[её]лок/i, 'р.п.'],
  [/пос[её]лок/i, 'п.'],
  [/хутор/i, 'х.'],
  [/деревн/i, 'д.'],
  [/город/i, 'г.'],
];

export const PLACES_QUERY = `[out:json][timeout:180];
area["ISO3166-1"="BY"][admin_level=2]->.a;
(
  node["place"~"^(city|town|village|hamlet)$"](area.a);
  way["place"~"^(city|town|village|hamlet)$"](area.a);
  relation["place"~"^(city|town|village|hamlet)$"](area.a);
);
out tags center;`;

export const BOUNDARIES_QUERY = `[out:json][timeout:180];
area["ISO3166-1"="BY"][admin_level=2]->.a;
relation["boundary"="administrative"]["admin_level"~"^(4|6)$"](area.a);
out tags geom;`;

export function encodeOsmId(type, id) {
  const numeric = BigInt(id);
  if (numeric <= 0n) return null;
  if (type === 'node') return numeric;
  if (type === 'way') return -numeric;
  if (type === 'relation') return -(1_000_000_000_000n + numeric);
  return null;
}

export function localityType(tags = {}) {
  const status = [
    tags.official_status,
    tags['official_status:ru'],
    tags.designation,
  ]
    .filter(Boolean)
    .join(' ');
  for (const [pattern, type] of STATUS_TYPES) {
    if (pattern.test(status)) return type;
  }
  if (tags.place === 'city' || tags.place === 'town') return 'г.';
  if (tags.place === 'village') return 'д.';
  if (tags.place === 'hamlet') return 'х.';
  return '';
}

export function localityName(tags = {}) {
  return normalizeWhitespace(tags['name:ru'] || tags.name || '');
}

function populationFromTags(tags) {
  if (!tags.population) return null;
  const value = Number(String(tags.population).replace(/[\s\u00a0]/g, ''));
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}

export function placeFromElement(element) {
  const tags = element?.tags || {};
  if (!PLACE_TAGS.has(tags.place)) return null;
  const latitude = element.lat ?? element.center?.lat ?? null;
  const longitude = element.lon ?? element.center?.lon ?? null;
  return {
    osmId: encodeOsmId(element.type, element.id),
    name: localityName(tags),
    type: localityType(tags),
    latitude: latitude == null ? null : Number(latitude),
    longitude: longitude == null ? null : Number(longitude),
    population: populationFromTags(tags),
    regionHint: normalizeWhitespace(tags['addr:region'] || tags['is_in:region'] || ''),
    districtHint: normalizeWhitespace(tags['addr:district'] || tags['is_in:district'] || ''),
  };
}

export function boundaryFromRelation(element) {
  const tags = element?.tags || {};
  if (element?.type !== 'relation') return null;
  if (tags.boundary !== 'administrative') return null;
  if (tags.admin_level !== '4' && tags.admin_level !== '6') return null;
  const name = localityName(tags);
  if (!name) return null;

  const outerParts = [];
  const innerParts = [];
  for (const member of element.members || []) {
    if (!member.geometry?.length) continue;
    const line = member.geometry.map((point) => ({ lat: Number(point.lat), lon: Number(point.lon) }));
    if (member.role === 'inner') innerParts.push(line);
    else if (member.role === 'outer' || member.role === '') outerParts.push(line);
  }
  const outers = assembleRings(outerParts);
  if (!outers.length) return null;
  return {
    name,
    level: tags.admin_level,
    outers,
    inners: assembleRings(innerParts),
    bbox: bboxOf(outers),
  };
}

export function indexBoundaries(elements) {
  const regions = [];
  const districts = [];
  for (const element of elements || []) {
    const boundary = boundaryFromRelation(element);
    if (!boundary) continue;
    if (boundary.level === '4') regions.push(boundary);
    else districts.push(boundary);
  }
  return { regions, districts };
}

export function readOverpassElements(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.elements)) return payload.elements;
  return [];
}
