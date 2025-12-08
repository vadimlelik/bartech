const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://technobar.by';

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
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}