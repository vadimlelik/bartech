import { SITE_URL as siteUrl } from '@/shared/config/site-url';

/** Paths blocked for all crawlers (including AI bots). */
export const DISALLOWED_PATHS = [
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
export const AI_CRAWLER_AGENTS = [
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

/** GET-параметры фильтрации категорий — не создают отдельные страницы для индекса. */
const YANDEX_CLEAN_PARAM_KEYS = [
  'sortBy',
  'sort',
  'search',
  'page',
  'memory',
  'ram',
  'processor',
  'display',
  'camera',
  'battery',
  'os',
  'color',
  'year',
];

function formatDisallowLines(paths) {
  return paths.map((path) => `Disallow: ${path}`).join('\n');
}

/**
 * Plain-text robots.txt (включая Yandex Clean-param).
 */
export function buildRobotsTxt() {
  const disallowBlock = formatDisallowLines(DISALLOWED_PATHS);
  const aiBlocks = AI_CRAWLER_AGENTS.map(
    (agent) => `User-agent: ${agent}\nAllow: /\n${disallowBlock}`,
  ).join('\n\n');

  const yandexCleanParam = `User-agent: Yandex\nAllow: /\n${disallowBlock}\nClean-param: ${YANDEX_CLEAN_PARAM_KEYS.join('&')} /categories/`;

  return `User-agent: *
Allow: /
${disallowBlock}

${yandexCleanParam}

${aiBlocks}

Sitemap: ${siteUrl}/sitemap.xml
`;
}
