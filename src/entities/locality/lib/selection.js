export const LOCALITY_COOKIE_NAME = 'locality';
export const LOCALITY_STORAGE_KEY = 'locality';
export const LOCALITY_CHANGE_EVENT = 'technobar:locality-change';
export const LOCALITY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const DEFAULT_LOCALITY = {
  id: null,
  name: 'Минск',
  type: 'г.',
  region: 'Минск',
  district: 'Минск',
  slug: 'minsk',
  serviceCitySlug: null,
};

export function localityCookieOptions() {
  return {
    path: '/',
    maxAge: LOCALITY_COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };
}

export function parseLocalityId(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0 ? value : null;
  }
  if (!/^\d+$/.test(String(value))) return null;
  const id = Number(value);
  return id > 0 ? id : null;
}

export function formatLocalityRegion(region) {
  return String(region || '')
    .trim()
    .replace(/область$/i, 'обл.')
    .trim();
}

export function formatLocalityLabel(item) {
  if (!item?.name) return formatLocalityShort(DEFAULT_LOCALITY);
  const place = `${item.type || 'г.'} ${item.name}`.replace(/\s+/g, ' ').trim();
  const region = formatLocalityRegion(item.region);
  const district = String(item.district || '').trim();
  if (!region && !district) return place;
  return `${place} [${[region, district].filter(Boolean).join(', ')}]`;
}

export function formatLocalityShort(item) {
  if (!item?.name) return 'г. Минск';
  return `${item.type || 'г.'} ${item.name}`.replace(/\s+/g, ' ').trim();
}
