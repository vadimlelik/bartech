import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { localitySlug, normalizeLocalityName } from '@/entities/locality/lib/normalize';
import {
  localityAdminWhere,
  parseCoordinate,
  parseLocalityAdminQuery,
  LOCALITY_TYPES,
} from '@/entities/locality/lib/admin-query';
import { parseLocalityId } from '@/entities/locality/lib/selection';
import { parseServiceCitySlug } from '@/entities/locality/lib/service-city';
import { adminJsonError, adminLocalityInclude, serializeAdminLocality } from './http';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await requireAdmin();
    const query = parseLocalityAdminQuery(request.nextUrl.searchParams);
    const where = localityAdminWhere(query);
    const [total, rows] = await Promise.all([
      prisma.locality.count({ where }),
      prisma.locality.findMany({
        where,
        include: adminLocalityInclude,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);
    return NextResponse.json({
      localities: rows.map(serializeAdminLocality),
      total,
      page: query.page,
      pageSize: query.pageSize,
    });
  } catch (error) {
    return adminJsonError(error, 'GET /api/admin/localities');
  }
}

async function freeSlug(name) {
  const base = localitySlug(name);
  let slug = base;
  let index = 2;
  while (await prisma.locality.findUnique({ where: { slug } })) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
}

function readLocalityBody(body) {
  const name = String(body.name || '').replace(/\s+/g, ' ').trim();
  const type = String(body.type || '').trim();
  const districtId = parseLocalityId(body.districtId);
  const latitude = parseCoordinate(body.latitude);
  const longitude = parseCoordinate(body.longitude);
  if (!name) return { error: 'Укажите название' };
  if (!LOCALITY_TYPES.includes(type)) return { error: 'Укажите тип населённого пункта' };
  if (!districtId) return { error: 'Укажите район' };
  if (body.latitude !== '' && body.latitude != null && latitude == null) return { error: 'Некорректная широта' };
  if (body.longitude !== '' && body.longitude != null && longitude == null) return { error: 'Некорректная долгота' };
  if (latitude != null && (latitude < -90 || latitude > 90)) return { error: 'Широта вне диапазона' };
  if (longitude != null && (longitude < -180 || longitude > 180)) return { error: 'Долгота вне диапазона' };
  const serviceCity = parseServiceCitySlug(body.serviceCitySlug);
  if (serviceCity.error) return { error: serviceCity.error };
  return {
    data: {
      name,
      nameNorm: normalizeLocalityName(name),
      type,
      districtId,
      latitude,
      longitude,
      isPopular: Boolean(body.isPopular),
      isActive: body.isActive !== false,
      serviceCitySlug: serviceCity.slug,
    },
  };
}

async function assertServiceCity(slug) {
  if (!slug) return null;
  const city = await prisma.city.findUnique({ where: { slug }, select: { slug: true } });
  return city ? null : 'Город обслуживания не найден';
}

export async function POST(request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const parsed = readLocalityBody(body);
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const district = await prisma.geoDistrict.findUnique({ where: { id: parsed.data.districtId } });
    if (!district) return NextResponse.json({ error: 'Район не найден' }, { status: 400 });
    const serviceCityError = await assertServiceCity(parsed.data.serviceCitySlug);
    if (serviceCityError) return NextResponse.json({ error: serviceCityError }, { status: 400 });
    const row = await prisma.locality.create({
      data: { ...parsed.data, slug: await freeSlug(parsed.data.name) },
      include: adminLocalityInclude,
    });
    return NextResponse.json({ locality: serializeAdminLocality(row) });
  } catch (error) {
    return adminJsonError(error, 'POST /api/admin/localities');
  }
}
