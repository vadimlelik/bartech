import { NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { listFormSubmissions } from '@/shared/lib/form-submissions';

export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '40', 10);
    const search = searchParams.get('search') || '';

    const result = await listFormSubmissions({ page, limit, search });

    return NextResponse.json({
      leads: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);

    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
