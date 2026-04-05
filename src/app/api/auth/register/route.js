import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import { hashPassword } from '@/shared/lib/password';
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
    const fullName =
      typeof body.fullName === 'string'
        ? body.fullName.trim()
        : typeof body.full_name === 'string'
          ? body.full_name.trim()
          : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Укажите email и пароль' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен быть не короче 6 символов' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName: fullName || null,
          role: 'user',
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже зарегистрирован' },
          { status: 409 }
        );
      }
      throw e;
    }

    await setSessionForUser(user);

    return NextResponse.json({
      user: toPublicUser(user),
      profile: toPublicProfile(user),
    });
  } catch (error) {
    console.error('POST /api/auth/register:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
