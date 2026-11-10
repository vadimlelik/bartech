import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { normalizeBannerSlugs } from '@/entities/city/lib/banners';

function serialize(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    href: row.href || '',
    image: row.image || '',
    placement: row.placement || 'home',
    enabled: row.enabled,
    citySlugs: row.citySlugs || [],
    sortOrder: row.sortOrder || 0,
  };
}

export async function GET() {
  try {
    await requireAdmin();
    const rows = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json({ banners: rows.map(serialize) });
  } catch (error) {
    const status = String(error.message).includes('Unauthorized') || String(error.message).includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: 'Нет доступа' }, { status });
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const row = await prisma.banner.create({
      data: {
        title: String(body.title || 'Акция').slice(0, 160),
        subtitle: String(body.subtitle || '').slice(0, 300),
        href: String(body.href || '').trim().slice(0, 300),
        image: body.image ? String(body.image).slice(0, 500) : null,
        placement: String(body.placement || 'home').slice(0, 40),
        enabled: body.enabled !== false,
        citySlugs: normalizeBannerSlugs(body.citySlugs),
        sortOrder: Number(body.sortOrder) || 0,
      },
    });
    revalidateTag('cities');
    return NextResponse.json({ banner: serialize(row) });
  } catch (error) {
    if (String(error.message).includes('Unauthorized') || String(error.message).includes('Forbidden')) {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
    }
    console.error('POST banner:', error);
    return NextResponse.json({ error: 'Не удалось создать баннер' }, { status: 500 });
  }
}
