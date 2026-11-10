import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { parseLocalityId } from '@/entities/locality/lib/selection';
import { adminJsonError, adminLocalityInclude, serializeAdminLocality } from '../http';
import { LOCALITY_TYPES, parseCoordinate } from '@/entities/locality/lib/admin-query';
import { normalizeLocalityName } from '@/entities/locality/lib/normalize';
import { parseServiceCitySlug } from '@/entities/locality/lib/service-city';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = parseLocalityId(rawId);
    if (!id) return NextResponse.json({ error: 'Некорректный id' }, { status: 400 });
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || '').replace(/\s+/g, ' ').trim();
    const type = String(body.type || '').trim();
    const districtId = parseLocalityId(body.districtId);
    const latitude = parseCoordinate(body.latitude);
    const longitude = parseCoordinate(body.longitude);
    if (!name) return NextResponse.json({ error: 'Укажите название' }, { status: 400 });
    if (!LOCALITY_TYPES.includes(type)) return NextResponse.json({ error: 'Укажите тип населённого пункта' }, { status: 400 });
    if (!districtId) return NextResponse.json({ error: 'Укажите район' }, { status: 400 });
    if (latitude != null && (latitude < -90 || latitude > 90)) {
      return NextResponse.json({ error: 'Широта вне диапазона' }, { status: 400 });
    }
    if (longitude != null && (longitude < -180 || longitude > 180)) {
      return NextResponse.json({ error: 'Долгота вне диапазона' }, { status: 400 });
    }
    const district = await prisma.geoDistrict.findUnique({ where: { id: districtId } });
    if (!district) return NextResponse.json({ error: 'Район не найден' }, { status: 400 });
    const serviceCity = parseServiceCitySlug(body.serviceCitySlug);
    if (serviceCity.error) return NextResponse.json({ error: serviceCity.error }, { status: 400 });
    if (serviceCity.slug) {
      const city = await prisma.city.findUnique({ where: { slug: serviceCity.slug }, select: { slug: true } });
      if (!city) return NextResponse.json({ error: 'Город обслуживания не найден' }, { status: 400 });
    }

    const row = await prisma.locality.update({
      where: { id },
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
      include: adminLocalityInclude,
    });
    return NextResponse.json({ locality: serializeAdminLocality(row) });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Населённый пункт не найден' }, { status: 404 });
    }
    return adminJsonError(error, 'PATCH /api/admin/localities/[id]');
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = parseLocalityId(rawId);
    if (!id) return NextResponse.json({ error: 'Некорректный id' }, { status: 400 });
    await prisma.locality.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Населённый пункт не найден' }, { status: 404 });
    }
    return adminJsonError(error, 'DELETE /api/admin/localities/[id]');
  }
}
