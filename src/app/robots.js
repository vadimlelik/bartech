const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvirko-vadim.ru';

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