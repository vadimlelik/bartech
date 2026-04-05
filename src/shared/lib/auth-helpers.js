import { cookies } from 'next/headers';
import { prisma } from '@/shared/lib/prisma';
import {
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
  sessionCookieOptions,
} from '@/shared/lib/auth-session';

export function toPublicUser(user) {
  if (!user) return null;
  return { id: user.id, email: user.email };
}

/** Совместимость с прежним форматом профиля (поле full_name) */
export function toPublicProfile(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    full_name: user.fullName || '',
    role: user.role,
  };
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function getSessionUser() {
  const payload = await getSessionPayload();
  if (!payload?.sub) return null;

  try {
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }

  return { user, profile: toPublicProfile(user) };
}

/**
 * Устанавливает сессионную cookie после успешного входа/регистрации.
 */
export async function setSessionForUser(user) {
  const token = await signSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
}
