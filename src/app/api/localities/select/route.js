import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/shared/lib/auth-helpers';
import { prisma } from '@/shared/lib/prisma';
import { parseLocalityId } from '@/entities/locality/lib/selection';
import { getActiveLocality, writeLocalityCookie } from '@/entities/locality/model/localities';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const id = parseLocalityId(body.id);
  if (!id) {
    return NextResponse.json({ error: 'Укажите город' }, { status: 400 });
  }

  try {
    const locality = await getActiveLocality(id);
    if (!locality) {
      return NextResponse.json({ error: 'Город не найден' }, { status: 404 });
    }

    const user = await getSessionUser();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { localityId: id },
      }).catch((error) => {
        console.error('profile locality:', error);
      });
    }

    const cookieStore = await cookies();
    writeLocalityCookie(cookieStore, locality.id);
    return NextResponse.json({ locality });
  } catch (error) {
    console.error('POST /api/localities/select:', error);
    return NextResponse.json({ error: 'Не удалось сохранить город' }, { status: 500 });
  }
}
