import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/checkout/',
          '/cart',
          '/favorites',
          '/compare',
          '/_next/',
          '/manifest.json',
          '/apple-touch-icon.png',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}