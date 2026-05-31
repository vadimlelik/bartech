/**
 * Landing indexation strategy — reduce keyword cannibalization between A/B variants.
 * Primary landings stay in sitemap; variants get noindex + canonical to primary.
 */

/** Money landings indexed in Google/Yandex */
export const INDEXED_LANDING_SLUGS = new Set(['phone', 'laptop', 'tv1', 'motoblok']);

/**
 * Variant / promo landings → canonical URL path on primary landing.
 * Used with noindex,follow so paid traffic works without competing in organic.
 */
export const LANDING_CANONICAL_TARGETS = {
  phone2: '/phone',
  phone3: '/phone',
  phone4: '/phone',
  phone5: '/phone',
  phone6: '/phone',
  phone7: '/phone',
  phone8: '/phone',
  '1phonefree': '/phone',
  '50discount': '/phone',
  'shockproof-phone': '/phone',
  laptop2: '/laptop',
  pc: '/laptop',
  tv2: '/tv1',
  tv3: '/tv1',
  motoblok1: '/motoblok',
  motoblok2: '/motoblok',
  scooter: '/',
  bicycles: '/',
};

/** Only indexed landings appear in sitemap.xml */
export const LANDING_SITEMAP_PRIORITIES = {
  phone: 0.85,
  laptop: 0.85,
  tv1: 0.85,
  motoblok: 0.7,
};

export const LEGIT_SUBDOMAINS = [
  ...Object.keys(LANDING_SITEMAP_PRIORITIES),
  ...Object.keys(LANDING_CANONICAL_TARGETS),
];
export const LEGIT_SUBDOMAINS_SET = new Set(LEGIT_SUBDOMAINS);
