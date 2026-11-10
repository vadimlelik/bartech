import { NextResponse } from 'next/server';
import { findLandingIdBySlug } from '@/entities/landing/model/landings-db';
import { requireAdmin } from '@/shared/lib/auth-helpers';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const slug = (searchParams.get('slug') || '').trim();
    const excludeRaw = searchParams.get('excludeId');
    const excludeId = excludeRaw ? Number(excludeRaw) : null;

    if (!SLUG_PATTERN.test(slug)) {
      return NextResponse.json({ available: false, reason: 'format', slug });
    }

    const existingId = await findLandingIdBySlug(slug);
    const excluded =
      excludeId !== null && !Number.isNaN(excludeId) && existingId === excludeId;
    const available = existingId === null || excluded;

    return NextResponse.json({ available, slug });
  } catch (error) {
    console.error('Error checking landing slug:', error);

    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
