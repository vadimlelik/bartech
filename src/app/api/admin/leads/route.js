import { NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { hasLeadFilter, parseLeadFilters, parseLeadIds, parseLeadQuery } from '@/shared/lib/lead-query';
import {
  deleteFormSubmissions,
  deleteFormSubmissionsByIds,
  listFormSubmissions,
} from '@/shared/lib/form-submissions';

export const dynamic = 'force-dynamic';

function adminError(error) {
  if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const result = await listFormSubmissions(parseLeadQuery(searchParams));

    return NextResponse.json({
      leads: result.items,
      pagination: result.pagination,
      options: result.options,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return adminError(error);
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
    }

    if (body.allMatching === true) {
      const parsed = parseLeadFilters(body, { strictDates: true });
      if (parsed.error) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      if (!hasLeadFilter(parsed.filters)) {
        return NextResponse.json({ error: 'Укажите выборку для удаления' }, { status: 400 });
      }

      const deleted = await deleteFormSubmissions(parsed.filters);
      return NextResponse.json({ deleted });
    }

    const parsedIds = parseLeadIds(body.ids);
    if (parsedIds.error) {
      return NextResponse.json({ error: parsedIds.error }, { status: 400 });
    }

    const deleted = await deleteFormSubmissionsByIds(parsedIds.ids);
    return NextResponse.json({ deleted });
  } catch (error) {
    console.error('Error deleting leads:', error);
    return adminError(error);
  }
}
