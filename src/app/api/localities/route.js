import { NextResponse } from 'next/server';
import { parseLocalitySearchParams } from '@/entities/locality/lib/search';
import { searchLocalities } from '@/entities/locality/model/localities';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const parsed = parseLocalitySearchParams(request.nextUrl.searchParams);
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const localities = await searchLocalities({ q: parsed.q, limit: parsed.limit });
    return NextResponse.json({ localities });
  } catch (error) {
    console.error('GET /api/localities:', error);
    return NextResponse.json({ error: 'Не удалось выполнить поиск' }, { status: 500 });
  }
}
