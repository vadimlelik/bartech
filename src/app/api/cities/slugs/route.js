import { NextResponse } from 'next/server';
import { getAllCities } from '@/entities/city/model/cities';
import { DEFAULT_CITY_SLUG } from '@/shared/config/city-routes';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cities = await getAllCities();
  const slugs = cities
    .map((city) => city.slug)
    .filter((slug) => slug && slug !== DEFAULT_CITY_SLUG);
  return NextResponse.json({ slugs });
}
