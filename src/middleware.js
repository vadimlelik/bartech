import { NextResponse } from 'next/server';
import {
  parseProductSegment,
  productPublicSegment,
  splitProductRequestPath,
} from '@/shared/lib/product-path';
import {
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from '@/shared/lib/auth-session';
import {
  CITY_COOKIE_MAX_AGE,
  CITY_COOKIE_NAME,
  DEFAULT_CITY_SLUG,
  isCityContentPath,
  redirectFromDefaultCityPrefix,
  CITY_ROUTE_SLUGS,
  splitCityFromPath,
} from '@/shared/config/city-routes';

const BLOCKED_SUBDOMAINS_SET = new Set(['www']);

function isValidLandingSubdomain(subdomain) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(subdomain || ''));
}

function withSameOriginFrame(response) {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  return response;
}

function rememberCity(response, slug) {
  response.cookies.set(CITY_COOKIE_NAME, slug, {
    path: '/',
    maxAge: CITY_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  return response;
}

let citySlugCache = { at: 0, slugs: CITY_ROUTE_SLUGS };
const productSegmentCache = new Map();

async function canonicalProductSegment(request, id) {
  const cached = productSegmentCache.get(id);
  if (cached && Date.now() - cached.at < 300_000) return cached.segment;
  try {
    const url = new URL(`/api/products/${id}`, request.url);
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const segment = productPublicSegment(data.product || data);
    if (!segment.startsWith(`${id}-`)) return null;
    productSegmentCache.set(id, { at: Date.now(), segment });
    return segment;
  } catch {
    return null;
  }
}

async function loadCityRouteSlugs(request) {
  const now = Date.now();
  if (now - citySlugCache.at < 30_000) return citySlugCache.slugs;
  try {
    const url = new URL('/api/cities/slugs', request.url);
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    });
    if (response.ok) {
      const data = await response.json();
      const fromDb = Array.isArray(data.slugs) ? data.slugs : [];
      citySlugCache = {
        at: now,
        slugs: [...new Set([...CITY_ROUTE_SLUGS, ...fromDb])],
      };
      return citySlugCache.slugs;
    }
  } catch {
    // База или внутренний запрос недоступны: остаются пять областных центров.
  }
  citySlugCache = { at: now, slugs: citySlugCache.slugs };
  return citySlugCache.slugs;
}

function withCityHeaders(request, slug, locked) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-city-slug', slug);
  if (locked) requestHeaders.set('x-city-locked', '1');
  return requestHeaders;
}

export async function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');
  const normalizedHostname = hostname?.split(':')[0].toLowerCase();
  const protocol = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');

  if (url.pathname === '/pdf-viewer') {
    return withSameOriginFrame(NextResponse.next());
  }

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

  // Next.js redirects() is case-insensitive and would loop on /categories/Laptops → /categories/laptops.
  const lowerPath = url.pathname.toLowerCase();
  if (url.pathname !== lowerPath) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = lowerPath;
    return NextResponse.redirect(redirectUrl, 301);
  }

  const domainPattern = /^([^.]+)\.technobar\.by$/;
  const subdomainMatch = normalizedHostname?.match(domainPattern);

  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    if (
      BLOCKED_SUBDOMAINS_SET.has(subdomain) ||
      !isValidLandingSubdomain(subdomain)
    ) {
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

  // /products/17326 и /products/17326-старое-имя → /products/17326-актуальное-имя
  const productRequest = splitProductRequestPath(url.pathname);
  const parsedProduct = productRequest && parseProductSegment(productRequest.segment);
  if (parsedProduct) {
    const segment = await canonicalProductSegment(request, parsedProduct.id);
    if (segment && segment !== productRequest.segment) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = `${productRequest.prefix}/products/${segment}`;
      return NextResponse.redirect(redirectUrl, 301);
    }
  }

  // Город определяет URL. По IP никого не перенаправляем, включая поисковых ботов.
  const defaultCityPath = redirectFromDefaultCityPrefix(url.pathname);
  if (defaultCityPath) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = defaultCityPath;
    return rememberCity(NextResponse.redirect(redirectUrl, 301), DEFAULT_CITY_SLUG);
  }

  const cityRoute = splitCityFromPath(url.pathname, await loadCityRouteSlugs(request));
  if (cityRoute.slug) {
    if (!isCityContentPath(cityRoute.pathname)) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = cityRoute.pathname;
      return rememberCity(NextResponse.redirect(redirectUrl, 301), cityRoute.slug);
    }

    const rewriteUrl = url.clone();
    rewriteUrl.pathname = cityRoute.pathname;
    const response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: withCityHeaders(request, cityRoute.slug, true) },
    });
    return rememberCity(response, cityRoute.slug);
  }

  if (isCityContentPath(url.pathname)) {
    return NextResponse.next({
      request: { headers: withCityHeaders(request, DEFAULT_CITY_SLUG, true) },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|apple-touch-icon.png|robots.txt|sitemap.xml).*)',
  ],
};
