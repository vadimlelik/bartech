import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { parseLocalityId } from '@/entities/locality/lib/selection';
import { adminJsonError } from '../http';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const ids = [...new Set((Array.isArray(body.ids) ? body.ids : []).map(parseLocalityId).filter(Boolean))];
    if (!ids.length || ids.length > 200) {
      return NextResponse.json({ error: 'Выберите от 1 до 200 населённых пунктов' }, { status: 400 });
    }
    const data = {};
    if (typeof body.isActive === 'boolean') data.isActive = body.isActive;
    if (typeof body.isPopular === 'boolean') data.isPopular = body.isPopular;
    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'Нечего изменять' }, { status: 400 });
    }
    const result = await prisma.locality.updateMany({ where: { id: { in: ids } }, data });
    return NextResponse.json({ updated: result.count });
  } catch (error) {
    return adminJsonError(error, 'POST /api/admin/localities/bulk');
  }
}
