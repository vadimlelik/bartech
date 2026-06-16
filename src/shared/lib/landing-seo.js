import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { LANDING_SEO_COPY } from '@/shared/config/landing-seo-copy';
import { LANDING_CANONICAL_TARGETS } from '@/shared/config/subdomains';

export const ROBOTS_NOINDEX_FOLLOW = { index: false, follow: true };
export const ROBOTS_NOINDEX_NOFOLLOW = { index: false, follow: false };

export function isIndexedLanding(slug) {
  if (LANDING_CANONICAL_TARGETS[slug]) {
    return false;
  }

  return true;
}

function resolveCanonicalUrl(slug, overrides = {}) {
  const targetPath = LANDING_CANONICAL_TARGETS[slug];
  if (targetPath) {
    return `${siteUrl}${targetPath}`;
  }
  const fromOverrides = overrides.alternates?.canonical;
  if (typeof fromOverrides === 'string') {
    return fromOverrides.startsWith('http')
      ? fromOverrides
      : `${siteUrl}${fromOverrides.startsWith('/') ? fromOverrides : `/${fromOverrides}`}`;
  }
  return `${siteUrl}/${slug}`;
}

/**
 * Apply indexation rules to landing metadata.
 * Explicit A/B variants stay noindex; admin-created slugs are indexable by default.
 */
export function mergeLandingMetadata(slug, metadata = {}) {
  const indexed = isIndexedLanding(slug);
  return {
    ...metadata,
    robots: indexed
      ? (metadata.robots ?? { index: true, follow: true })
      : (metadata.robots ?? ROBOTS_NOINDEX_FOLLOW),
    alternates: {
      ...metadata.alternates,
      canonical: resolveCanonicalUrl(slug, metadata),
    },
  };
}

/** Minimal metadata for client-only landing routes (via layout.jsx). */
export function buildLandingLayoutMetadata(slug, overrides = {}) {
  const seoCopy = LANDING_SEO_COPY[slug];
  return mergeLandingMetadata(slug, {
    title: overrides.title ?? seoCopy?.title ?? `Texnobar — ${slug}`,
    description:
      overrides.description ??
      seoCopy?.description ??
      'Акции и рассрочка на технику в Минске — интернет-магазин Texnobar.',
    ...overrides,
  });
}
