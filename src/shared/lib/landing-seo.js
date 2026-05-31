import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import {
  INDEXED_LANDING_SLUGS,
  LANDING_CANONICAL_TARGETS,
} from '@/shared/config/subdomains';

export const ROBOTS_NOINDEX_FOLLOW = { index: false, follow: true };
export const ROBOTS_NOINDEX_NOFOLLOW = { index: false, follow: false };

export function isIndexedLanding(slug) {
  return INDEXED_LANDING_SLUGS.has(slug);
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
 * Apply indexation rules to landing metadata (static pages & layouts).
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
  return mergeLandingMetadata(slug, {
    title: overrides.title ?? `Texnobar — ${slug}`,
    description:
      overrides.description ??
      'Акции и рассрочка на технику в Минске — интернет-магазин Texnobar.',
    ...overrides,
  });
}
