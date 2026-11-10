import { normalizeLocalityName } from './normalize.js';
import { parseLocalityId } from './selection.js';

export const LOCALITY_ADMIN_PAGE_SIZE = 25;
export const LOCALITY_TYPES = ['г.', 'г.п.', 'д.', 'п.', 'аг.', 'х.', 'р.п.', 'к.п.'];

function parseFlag(value) {
  if (value === '1' || value === 'true') return true;
  if (value === '0' || value === 'false') return false;
  return null;
}

export function parseLocalityAdminQuery(searchParams) {
  const pageRaw = Number(searchParams.get('page') || 1);
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  return {
    q: normalizeLocalityName(searchParams.get('q') || ''),
    regionId: parseLocalityId(searchParams.get('regionId')),
    districtId: parseLocalityId(searchParams.get('districtId')),
    popular: parseFlag(searchParams.get('popular')),
    active: parseFlag(searchParams.get('active')),
    page,
    pageSize: LOCALITY_ADMIN_PAGE_SIZE,
  };
}

export function localityAdminWhere(query) {
  const where = {};
  if (query.q) where.nameNorm = { contains: query.q };
  if (query.districtId) where.districtId = query.districtId;
  else if (query.regionId) where.district = { regionId: query.regionId };
  if (query.popular != null) where.isPopular = query.popular;
  if (query.active != null) where.isActive = query.active;
  return where;
}

export function parseCoordinate(value) {
  if (value == null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
