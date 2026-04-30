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
  const protocol = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');

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

  const staticPaths = [
    '/static',
    '/_next',
    '/favicon.ico',
    '/manifest.json',
    '/apple-touch-icon.png',
    '/robots.txt',
    '/sitemap.xml',
  ];
  if (staticPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const domainPattern = /^([^.]+)\.technobar\.by$/;
  const subdomainMatch = normalizedHostname?.match(domainPattern);

  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    if (!LEGIT_SUBDOMAINS_SET.has(subdomain)) {
      const canonicalUrl = new URL(request.url);
      canonicalUrl.protocol = 'https:';
      canonicalUrl.host = 'technobar.by';
      return NextResponse.redirect(canonicalUrl, 308);
    }

    // На лендинговых поддоменах оставляем только корень и thank-you.
    // Остальные вложенные пути канонизируем на основной домен.
    const allowedSubdomainPaths = new Set(['/', '/thank-you']);
    if (!allowedSubdomainPaths.has(url.pathname)) {
      const canonicalPathUrl = new URL(request.url);
      canonicalPathUrl.protocol = 'https:';
      canonicalPathUrl.host = 'technobar.by';
      return NextResponse.redirect(canonicalPathUrl, 308);
    }

    const newUrl = new URL(request.url);
    newUrl.pathname = `/${subdomain}${url.pathname}`;

    return NextResponse.rewrite(newUrl);
  }

  if (normalizedHostname === 'technobar.by' && protocol !== 'https') {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|apple-touch-icon.png|robots.txt|sitemap.xml).*)',
  ],
};
