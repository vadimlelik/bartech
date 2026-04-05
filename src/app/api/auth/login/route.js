import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { verifyPassword } from '@/shared/lib/password';
import {
  setSessionForUser,
  toPublicUser,
  toPublicProfile,
} from '@/shared/lib/auth-helpers';

export async function POST(request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'База данных не настроена (DATABASE_URL)' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Укажите email и пароль' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    await setSessionForUser(user);

    return NextResponse.json({
      user: toPublicUser(user),
      profile: toPublicProfile(user),
    });
  } catch (error) {
    console.error('POST /api/auth/login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
