# SEO + GEO Audit: technobar.by

**Дата:** 2026-05-31  
**Проект:** bartech (Next.js 15, e-commerce)  
**URL:** https://technobar.by  
**Тип бизнеса:** E-commerce + локальный (Минск, рассрочка)

---

## Сводные оценки

| Область | Оценка | Статус |
|---------|--------|--------|
| SEO Health (классика) | **62/100** | Средне — база есть, критичные пробелы |
| GEO Score (AI-поиск) | **38/100** | Низко — AI-боты заблокированы на prod |
| Schema / Structured Data | **72/100** | Хорошая база в `seo.js` |
| Technical SEO | **58/100** | SPA, OG SVG, Cloudflare robots |
| Content / E-E-A-T | **65/100** | FAQ на главной, нужны answer-блоки |
| Local SEO | **70/100** | LocalBusiness, адрес, geo meta |

---

## Критические находки (P0)

### 1. Cloudflare блокирует AI-краулеры (prod)

Live `robots.txt` содержит **Cloudflare Managed Content**, который запрещает:

- GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider, meta-externalagent, Applebot-Extended

**Это главный блокер GEO.** Код Next.js (`robots.js`) не управляет этими правилами — их добавляет Cloudflare.

**Действие:** Cloudflare Dashboard → Security → Bots → отключить «Block AI bots» / AI Crawl Control, либо настроить allow для нужных ботов.

### 2. OG-изображение — SVG

Facebook, Telegram, LinkedIn плохо поддерживают SVG для `og:image`. Рекомендуется PNG 1200×630.

**Действие:** `opengraph-image.jsx` (генерация PNG) — реализовано в P0.

### 3. Google Search Console не подключён

`verification.google` закомментирован в `layout.js`.

**Действие:** env `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — реализовано в P0.

### 4. Нет llms.txt

**Действие:** `public/llms.txt` — реализовано в P0.

---

## SEO Audit (claude-seo lens)

### Что работает хорошо

- Metadata: title, description, keywords, canonical на главной и товарах
- `sitemap.xml` — категории, товары, лендинги, статические страницы
- `robots.js` — закрыты `/api/`, `/admin/`, корзина, checkout
- JSON-LD: Organization, LocalBusiness, WebSite, Product, BreadcrumbList
- Product Offer: `hasMerchantReturnPolicy`, shipping, priceValidUntil
- Yandex Webmaster verification
- FAQ-секция на главной (рассрочка)
- GTM подключён

### Проблемы (P1+)

| # | Проблема | Приоритет |
|---|----------|-----------|
| 1 | 20+ лендингов в sitemap — риск cannibalization | P1 |
| 2 | Product OG `type: 'website'` вместо `product` | P1 |
| 3 | Breadcrumb schema: `categoryId` вместо имени категории | P1 |
| 4 | `sameAs: []` пустой в Organization/LocalBusiness | P2 |
| 5 | `/pass`, `/test` без noindex | P2 |
| 6 | Дубли title на главной (двойной `\| Texnobar`) в HTML | P2 |
| 7 | Core Web Vitals — GTM + client hydration | P2 |

---

## GEO Audit (geo-seo-claude lens)

### AI Citability (25% weight) — ~45/100

- Главная: есть H1, FAQ, факты о рассрочке — хорошо
- Нет self-contained answer-блоков 134–167 слов на money-страницах
- Заголовки частично в форме вопросов (FAQ) — хорошо

### Brand Authority (20%) — ~30/100

- `sameAs` пустой — нет связи с соцсетями/картами в schema
- Brand mentions на внешних платформах не проверялись (нужен ручной / geo brands)

### AI Crawler Access — **0/100 на prod**

Cloudflare Disallow для всех major AI bots.

### Platform Readiness — ~40/100

- Google: индексируется (обычный Googlebot не заблокирован)
- ChatGPT/Perplexity/Claude: **заблокированы на prod**

### Structured Data (10%) — ~72/100

Сильная e-commerce база; gaps: AggregateRating на reviews page, ItemList на категориях.

---

## Prioritized Backlog

### P0 — Quick wins (этот PR)

- [x] OG PNG через `opengraph-image.jsx`
- [x] Централизовать OG URL в `seo.js`
- [x] `robots.js` — явный allow для AI crawlers (код)
- [x] `public/llms.txt`
- [x] Google verification через env
- [ ] **Cloudflare: разблокировать AI bots** (ручная настройка в панели)

### P1 — 1–2 недели

- Product OG type → `product`
- Canonical на всех landing/shop страницах
- Стратегия лендингов: noindex или canonical на категорию
- `sameAs` — Instagram, Google Maps, 2GIS

### P2 — 1 месяц

- Answer-блоки на `/installment`, топ-категориях
- ItemList schema на категориях
- Google Search Console + CrUX мониторинг (`/seo google setup`)
- noindex для `/pass`, `/test`, `/pdf-viewer`

---

## Следующий audit

После деплоя P0 и правки Cloudflare:

```
Проведи GEO quick audit technobar.by — проверь robots.txt и og:image
```
