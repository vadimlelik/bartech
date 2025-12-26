import { NextResponse } from 'next/server';
import { getLandingBySlug } from '@/lib/landings-supabase';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const landing = await getLandingBySlug(slug);
    if (!landing) {
      return NextResponse.json({ error: 'Landing not found' }, { status: 404 });
    }

    return NextResponse.json({ landing });
  } catch (error) {
    console.error('Error fetching landing by slug:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

