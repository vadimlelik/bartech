# Cloudflare: разблокировка AI-ботов (P0 — вручную)

**Проблема:** на production `https://technobar.by/robots.txt` Cloudflare добавляет блок:

```
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /
...
```

Эти правила **перекрывают** Next.js `src/app/robots.js`.

## Что сделать

1. Войти в [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Выбрать домен **technobar.by**
3. **Security** → **Bots** (или **AI Crawl Control** / **Block AI bots**)
4. Отключить блокировку AI-ботов **или** разрешить:
   - GPTBot, ClaudeBot, PerplexityBot, Google-Extended
5. Подождать 5–15 минут и проверить:

```bash
curl -s https://technobar.by/robots.txt | grep -A1 GPTBot
```

Ожидаемый результат после fix: `Allow: /` (или отсутствие `Disallow: /` для AI-ботов).

## После деплоя кода

Next.js отдаёт явный `Allow` для AI crawlers. Когда Cloudflare перестанет их блокировать, GEO-аудит покажет улучшение по AI Crawler Access.
