import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';

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
