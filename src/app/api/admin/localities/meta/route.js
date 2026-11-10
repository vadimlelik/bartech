import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { adminJsonError } from '../http';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const [regions, districts, cities] = await Promise.all([
      prisma.geoRegion.findMany({ orderBy: { name: 'asc' } }),
      prisma.geoDistrict.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, regionId: true } }),
      prisma.city.findMany({ orderBy: { sortOrder: 'asc' }, select: { slug: true, name: true } }),
    ]);
    return NextResponse.json({ regions, districts, cities });
  } catch (error) {
    return adminJsonError(error, 'GET /api/admin/localities/meta');
  }
}
