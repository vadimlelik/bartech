import { NextResponse } from 'next/server';

export function adminJsonError(error, logLabel) {
  const denied = String(error?.message).includes('Unauthorized') || String(error?.message).includes('Forbidden');
  if (!denied) console.error(logLabel, error);
  return NextResponse.json(
    { error: denied ? 'Нет доступа' : 'Не удалось выполнить запрос' },
    { status: denied ? 403 : 500 },
  );
}

export function serializeAdminLocality(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    slug: row.slug,
    latitude: row.latitude,
    longitude: row.longitude,
    population: row.population,
    osmId: row.osmId == null ? null : String(row.osmId),
    isPopular: row.isPopular,
    isActive: row.isActive,
    serviceCitySlug: row.serviceCitySlug || null,
    districtId: row.districtId,
    district: row.district?.name || '',
    regionId: row.district?.region?.id || null,
    region: row.district?.region?.name || '',
  };
}

export function serializeImportRun(row) {
  if (!row) return null;
  return {
    id: row.id,
    status: row.status,
    added: row.added,
    updated: row.updated,
    unchanged: row.unchanged,
    skipped: row.skipped,
    error: row.error || '',
    createdAt: row.createdAt,
    finishedAt: row.finishedAt,
  };
}

export const adminLocalityInclude = {
  district: { select: { name: true, region: { select: { id: true, name: true } } } },
};
