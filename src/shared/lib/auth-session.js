import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE_NAME = 'bartech_session';

const DEV_FALLBACK_SECRET = 'dev-only-bartech-auth-secret-32+';

export function getAuthSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  if (process.env.NODE_ENV !== 'production') {
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }
  throw new Error(
    'AUTH_SECRET is required in production (min 32 characters). Set it in your environment.'
  );
}

/**
 * @param {{ sub: string, email: string, role: string }} payload
 */
export async function signSessionToken(payload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getAuthSecretKey());
}

export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, getAuthSecretKey());
    const sub = payload.sub;
    const email = typeof payload.email === 'string' ? payload.email : '';
    const role = typeof payload.role === 'string' ? payload.role : 'user';
    if (!sub) return null;
    return { sub, email, role };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}
