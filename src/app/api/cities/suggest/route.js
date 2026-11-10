import { NextResponse } from 'next/server';
import { getIndexableCities } from '@/entities/city/model/cities';

const BOT_UA =
  /googlebot|adsbot-google|mediapartners-google|yandexbot|yandexmobilebot|bingbot|duckduckbot|baiduspider|slurp|facebot|applebot|petalbot|semrushbot|ahrefsbot/i;

export async function GET(request) {
  const userAgent = request.headers.get('user-agent') || '';
  if (BOT_UA.test(userAgent)) {
    return NextResponse.json({ slug: null });
  }

  // TODO: подключить источник «IP → город» (заголовок прокси или локальная база).
  // Без источника город не угадываем и никого не перенаправляем.
  const hinted = String(request.headers.get('x-city-suggest') || '')
    .trim()
    .toLowerCase();
  if (!hinted) {
    return NextResponse.json({ slug: null });
  }

  const cities = await getIndexableCities();
  const match = cities.find((city) => city.slug === hinted);
  return NextResponse.json({ slug: match?.slug || null });
}
