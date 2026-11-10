import { cookies } from 'next/headers';
import { prisma } from '@/shared/lib/prisma';
import { getSessionUser } from '@/shared/lib/auth-helpers';
import {
  exactLocalityWhere,
  localityMatchOrder,
  popularLocalityWhere,
  prefixLocalityWhere,
  toLocalitySearchHit,
  LOCALITY_SEARCH_MAX_LIMIT,
} from '../lib/search.js';
import {
  DEFAULT_LOCALITY,
  LOCALITY_COOKIE_NAME,
  localityCookieOptions,
  parseLocalityId,
} from '../lib/selection.js';

const localitySearchInclude = {
  district: {
    select: {
      name: true,
      region: { select: { name: true } },
    },
  },
};

function fromDb(row) {
  return toLocalitySearchHit({
    id: row.id,
    name: row.name,
    type: row.type,
    region: row.district.region.name,
    district: row.district.name,
    slug: row.slug,
  });
}

async function readMatches(where, take) {
  const rows = await prisma.locality.findMany({
    where,
    orderBy: localityMatchOrder,
    take,
    include: localitySearchInclude,
  });
  return rows.map(fromDb);
}

export async function searchLocalities({ q, limit }) {
  if (!q) {
    return readMatches(popularLocalityWhere(), limit);
  }

  const exact = await readMatches(exactLocalityWhere(q), limit);
  if (exact.length >= limit) return exact;

  const rest = await readMatches(prefixLocalityWhere(q), limit - exact.length);
  return [...exact, ...rest];
}

export async function listPopularLocalities() {
  return readMatches(popularLocalityWhere(), LOCALITY_SEARCH_MAX_LIMIT);
}

export async function getActiveLocality(id) {
  const localityId = parseLocalityId(id);
  if (!localityId) return null;
  const row = await prisma.locality.findFirst({
    where: { id: localityId, isActive: true },
    include: localitySearchInclude,
  });
  if (!row) return null;
  return { ...fromDb(row), serviceCitySlug: row.serviceCitySlug || null };
}

export function writeLocalityCookie(cookieStore, id) {
  cookieStore.set(LOCALITY_COOKIE_NAME, String(id), localityCookieOptions());
}

export async function getSelectedLocality() {
  try {
    const cookieStore = await cookies();
    const fromCookie = await getActiveLocality(cookieStore.get(LOCALITY_COOKIE_NAME)?.value);
    if (fromCookie) return fromCookie;

    const user = await getSessionUser();
    if (user?.localityId) {
      const fromProfile = await getActiveLocality(user.localityId);
      if (fromProfile) return fromProfile;
    }
  } catch (error) {
    console.error('getSelectedLocality:', error);
  }
  return DEFAULT_LOCALITY;
}

export async function rememberProfileLocality(user) {
  if (!user?.localityId) return;
  const cookieStore = await cookies();
  if (cookieStore.get(LOCALITY_COOKIE_NAME)?.value) return;
  const locality = await getActiveLocality(user.localityId);
  if (!locality?.id) return;
  writeLocalityCookie(cookieStore, locality.id);
}
