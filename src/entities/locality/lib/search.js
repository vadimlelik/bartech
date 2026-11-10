import { normalizeLocalityName, normalizeWhitespace } from './normalize.js';

export const LOCALITY_SEARCH_DEFAULT_LIMIT = 15;
export const LOCALITY_SEARCH_MAX_LIMIT = 50;
export const LOCALITY_SEARCH_MAX_QUERY = 80;

const LIMIT_ERROR = 'limit должен быть целым числом от 1 до 50';

export function parseLocalitySearchParams(searchParams) {
  const rawQuery = searchParams.get('q');
  const visible = rawQuery == null ? '' : normalizeWhitespace(rawQuery);
  if (visible.length > LOCALITY_SEARCH_MAX_QUERY) {
    return { error: 'Слишком длинный запрос' };
  }

  const rawLimit = searchParams.get('limit');
  let limit = LOCALITY_SEARCH_DEFAULT_LIMIT;
  if (rawLimit != null && rawLimit !== '') {
    if (!/^\d+$/.test(rawLimit)) {
      return { error: LIMIT_ERROR };
    }
    limit = Number(rawLimit);
    if (limit < 1 || limit > LOCALITY_SEARCH_MAX_LIMIT) {
      return { error: LIMIT_ERROR };
    }
  }

  const q = normalizeLocalityName(visible);
  return { q, limit, popular: q === '' };
}

export function exactLocalityWhere(q) {
  return { isActive: true, nameNorm: q };
}

export function prefixLocalityWhere(q) {
  return {
    isActive: true,
    nameNorm: { startsWith: q },
    NOT: { nameNorm: q },
  };
}

export function popularLocalityWhere() {
  return { isActive: true, isPopular: true };
}

export const localityMatchOrder = [
  { population: { sort: 'desc', nulls: 'last' } },
  { name: 'asc' },
  { id: 'asc' },
];

export function toLocalitySearchHit(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    region: row.region,
    district: row.district,
    slug: row.slug,
  };
}

function byPopulationThenName(left, right) {
  const population = (right.population || 0) - (left.population || 0);
  if (population) return population;
  const name = left.name.localeCompare(right.name, 'ru');
  if (name) return name;
  return left.id - right.id;
}

export function selectLocalities(rows, { q, limit }) {
  const active = rows.filter((row) => row.isActive);
  const pool = q
    ? active.filter((row) => row.nameNorm.startsWith(q))
    : active.filter((row) => row.isPopular);
  const exact = [];
  const prefix = [];
  for (const row of pool) {
    if (q && row.nameNorm === q) exact.push(row);
    else prefix.push(row);
  }
  exact.sort(byPopulationThenName);
  prefix.sort(byPopulationThenName);
  return [...exact, ...prefix].slice(0, limit).map(toLocalitySearchHit);
}
