import { NextResponse } from 'next/server';
import { listPopularLocalities } from '@/entities/locality/model/localities';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const localities = await listPopularLocalities();
    return NextResponse.json({ localities });
  } catch (error) {
    console.error('GET /api/localities/popular:', error);
    return NextResponse.json({ error: 'Не удалось загрузить города' }, { status: 500 });
  }
}
