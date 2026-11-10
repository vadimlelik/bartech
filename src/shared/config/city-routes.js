import { LEGIT_SUBDOMAINS } from './subdomains.js';

/** Слаги, которые middleware считает префиксом города, если список из базы недоступен. Минск живёт на корне. */
export const DEFAULT_CITY_SLUG = 'minsk';

export const CITY_ROUTE_SLUGS = [
  'grodno',
  'brest',
  'vitebsk',
  'gomel',
  'mogilev',
  'baranovici',
  'bobruisk',
  'borisov',
  'pinsk',
];

const CITY_ROUTE_SET = new Set(CITY_ROUTE_SLUGS);

/** Первые сегменты, которые уже заняты магазином или лендингом. */
export const RESERVED_CITY_SLUGS = new Set([
  DEFAULT_CITY_SLUG,
  'products',
  'categories',
  'catalog',
  'cart',
  'checkout',
  'search',
  'favorites',
  'compare',
  'contacts',
  'payment_delivery',
  'admin',
  'auth',
  'installment',
  'offer',
  'privacy',
  'return',
  'reviews',
  'sales',
  'guarantee',
  'service',
  'pk',
  'po',
  'mt',
  'videowatching',
  'pass',
  'pdf-viewer',
  'thank-you',
  'test',
  'api',
  'static',
  'sitemap',
  'robots',
  ...LEGIT_SUBDOMAINS,
]);

export function isCityRouteSlug(slug) {
  return CITY_ROUTE_SET.has(slug);
}

export function normalizeCitySlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function citySlugError(slug) {
  if (!slug || slug.length < 2 || slug.length > 40) {
    return 'Слаг: 2–40 символов латиницей, например baranovichi';
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return 'Слаг: только латиница, цифры и дефис';
  }
  if (RESERVED_CITY_SLUGS.has(slug)) {
    return 'Этот адрес уже занят страницей сайта';
  }
  return '';
}

function routeSlugSet(knownSlugs) {
  if (!knownSlugs) return CITY_ROUTE_SET;
  const set = new Set(CITY_ROUTE_SLUGS);
  for (const slug of knownSlugs) {
    if (slug && slug !== DEFAULT_CITY_SLUG) set.add(slug);
  }
  return set;
}

export const CITY_COOKIE_NAME = 'city';
export const CITY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const CITY_EXACT_PATHS = new Set(['/', '/payment_delivery', '/contacts']);

export function isCityContentPath(pathname) {
  const path = pathname || '/';
  if (CITY_EXACT_PATHS.has(path)) return true;
  if (/^\/categories\/[^/]+$/.test(path)) return true;
  return /^\/products\/[^/]+$/.test(path);
}

export function redirectFromDefaultCityPrefix(pathname) {
  const parts = String(pathname || '/')
    .split('/')
    .filter(Boolean);
  if (parts[0] !== DEFAULT_CITY_SLUG) return null;
  const rest = `/${parts.slice(1).join('/')}`;
  return rest === '/' ? '/' : rest;
}

export function splitCityFromPath(pathname, knownSlugs) {
  const path = pathname || '/';
  const parts = path.split('/').filter(Boolean);
  if (!parts.length || !routeSlugSet(knownSlugs).has(parts[0])) {
    return { slug: null, pathname: path.startsWith('/') ? path : `/${path}` };
  }
  const rest = `/${parts.slice(1).join('/')}`;
  return { slug: parts[0], pathname: rest === '/' ? '/' : rest };
}

export function stripCityPrefix(pathname, knownSlugs) {
  return splitCityFromPath(pathname, knownSlugs).pathname || '/';
}

export function withCityPrefix(slug, href, knownSlugs) {
  if (!href) return href;
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:') ||
    href.startsWith('#')
  ) {
    return href;
  }

  const hashIndex = href.indexOf('#');
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf('?');
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : '';
  const pathOnly = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const { pathname } = splitCityFromPath(normalized, knownSlugs);

  if (!slug || slug === DEFAULT_CITY_SLUG || !isCityContentPath(pathname)) {
    return `${pathname}${query}${hash}`;
  }

  if (pathname === '/') {
    return `/${slug}${query}${hash}`;
  }
  return `/${slug}${pathname}${query}${hash}`;
}

export function citySwitchHref(slug, href, knownSlugs) {
  const raw = String(href || '/');
  const hashIndex = raw.indexOf('#');
  const hash = hashIndex >= 0 ? raw.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
  const queryIndex = withoutHash.indexOf('?');
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : '';
  const pathOnly = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const { pathname } = splitCityFromPath(normalized, knownSlugs);
  if (!isCityContentPath(pathname)) {
    return withCityPrefix(slug, '/', knownSlugs);
  }
  return withCityPrefix(slug, `${pathname}${query}${hash}`, knownSlugs);
}
