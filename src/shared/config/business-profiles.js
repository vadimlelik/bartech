import { SITE_URL as siteUrl } from '@/shared/config/site-url';

/** Google Maps / 2GIS / Instagram — optional via env (see docs/seo/ENV.md). */
export function getBusinessSameAs() {
  const candidates = [
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_2GIS_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_TELEGRAM_URL,
  ].filter(Boolean);

  if (candidates.length > 0) {
    return [...new Set(candidates)];
  }

  return [
    `${siteUrl}/contacts`,
    'https://www.google.com/maps/search/?api=1&query=53.9085,27.5685',
  ];
}
