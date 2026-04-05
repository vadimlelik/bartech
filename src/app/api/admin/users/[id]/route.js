import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';

export async function PATCH(request, { params }) {
  try {
    const { user: adminUser } = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be "user" or "admin"' }, { status: 400 });
    }

    if (id === adminUser.id) {
      return NextResponse.json({ error: 'Нельзя изменить свою собственную роль' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user: adminUser } = await requireAdmin();
    const { id } = await params;

    if (id === adminUser.id) {
      return NextResponse.json({ error: 'Нельзя удалить собственный аккаунт' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
