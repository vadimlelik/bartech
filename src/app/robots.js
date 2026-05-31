import { SITE_URL as siteUrl } from '@/shared/config/site-url';

/** Paths blocked for all crawlers (including AI bots). */
const DISALLOWED_PATHS = [
  '/api/',
  '/admin/',
  '/checkout/',
  '/cart',
  '/favorites',
  '/compare',
  '/_next/',
  '/manifest.json',
  '/apple-touch-icon.png',
];

/**
 * AI crawlers explicitly allowed on public catalog/content.
 * Note: Cloudflare "Block AI bots" may override robots.txt on production —
 * disable it in Cloudflare Dashboard for these rules to take effect.
 */
const AI_CRAWLER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'meta-externalagent',
  'Amazonbot',
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      ...AI_CRAWLER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
