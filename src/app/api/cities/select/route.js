import { NextResponse } from 'next/server';
import { CITY_COOKIE_MAX_AGE, CITY_COOKIE_NAME } from '@/shared/config/city-routes';
import { getAllCities } from '@/entities/city/model/cities';
import { isCityPublic } from '@/entities/city/lib/city-content';
import { getSessionUser } from '@/shared/lib/auth-helpers';
import { prisma } from '@/shared/lib/prisma';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const slug = String(body.slug || '').trim();
  const cities = await getAllCities();
  const city = cities.find((item) => item.slug === slug && isCityPublic(item));
  if (!city) {
    return NextResponse.json({ error: 'Город выключен' }, { status: 404 });
  }

  const user = await getSessionUser();
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { citySlug: slug },
    }).catch((error) => {
      console.error('profile city:', error);
    });
  }

  const response = NextResponse.json({ slug });
  response.cookies.set(CITY_COOKIE_NAME, slug, {
    path: '/',
    maxAge: CITY_COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
