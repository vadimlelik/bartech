import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { normalizeBannerSlugs } from '@/entities/city/lib/banners';

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const title = String(body.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Укажите заголовок' }, { status: 400 });
    }
    const row = await prisma.banner.update({
      where: { id },
      data: {
        title: title.slice(0, 160),
        subtitle: String(body.subtitle || '').trim().slice(0, 300),
        href: String(body.href || '').trim().slice(0, 300),
        citySlugs: normalizeBannerSlugs(body.citySlugs),
        enabled: body.enabled !== false,
      },
    });
    revalidateTag('cities');
    return NextResponse.json({
      banner: {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle || '',
        href: row.href || '',
        citySlugs: row.citySlugs || [],
        enabled: row.enabled,
      },
    });
  } catch (error) {
    if (String(error.message).includes('Unauthorized') || String(error.message).includes('Forbidden')) {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Не удалось сохранить баннер' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    revalidateTag('cities');
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (String(error.message).includes('Unauthorized') || String(error.message).includes('Forbidden')) {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Не удалось удалить баннер' }, { status: 500 });
  }
}
