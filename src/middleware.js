import { NextResponse } from 'next/server';
import {
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from '@/shared/lib/auth-session';
import { LEGIT_SUBDOMAINS_SET } from '@/shared/config/subdomains';

export async function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');
  const normalizedHostname = hostname?.split(':')[0].toLowerCase();

  if (url.pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const payload = await verifySessionToken(token);

    if (!payload || payload.role !== 'admin') {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', url.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  const domainPattern = /^([^.]+)\.technobar\.by$/;
  const subdomainMatch = normalizedHostname?.match(domainPattern);

  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    if (!LEGIT_SUBDOMAINS_SET.has(subdomain)) {
      return NextResponse.next();
    }

    const newUrl = new URL(request.url);
    newUrl.pathname = `/${subdomain}${url.pathname}`;

    return NextResponse.rewrite(newUrl);
  }

  const staticPaths = ['/static', '/_next', '/favicon.ico'];
  if (staticPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
