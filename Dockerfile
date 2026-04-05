# Multi-stage build для оптимизации размера образа
# Next.js 15 рекомендуется использовать Node.js 20+
FROM node:20-alpine AS base

# Сборка приложения
FROM base AS builder
WORKDIR /app

COPY package.json package-lock.json ./
# postinstall (prisma generate) требует prisma/schema.prisma — его ещё нет до COPY . .
RUN npm ci --ignore-scripts
COPY . .
# Prisma Client (без подключения к БД на этапе сборки)
RUN npx prisma generate
# Очищаем кеш Next.js перед сборкой для предотвращения проблем с require
RUN rm -rf .next || true
# Увеличиваем лимит памяти для процесса сборки (до 8GB)
# Добавляем дополнительные флаги для стабильности
ENV NODE_OPTIONS="--max_old_space_size=8192 --max-semi-space-size=128"
# Отключаем телеметрию Next.js для ускорения сборки
ENV NEXT_TELEMETRY_DISABLED=1
# Меньше места на диске при сборке (иначе webpack PackFileCache → ENOSPC на маленьких VPS)
ENV DOCKER_BUILD=1
# Сборка и очистка тяжёлых кешей в том же слое (экономия места на диске хоста при build)
RUN npm run build && rm -rf .next/cache node_modules/.cache 2>/dev/null || true

# Production образ
FROM base AS runner
WORKDIR /app

# NODE_ENV=production только после установки prisma CLI: иначе npm отрезает зависимости (effect, c12, …)
ENV NEXT_TELEMETRY_DISABLED=1

# Устанавливаем wget для health check
RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Копируем директорию data для fallback JSON файлов (используются в runtime)
COPY --from=builder /app/data ./data
# Схема и миграции
COPY --from=builder /app/prisma ./prisma
# Полное дерево зависимостей Prisma CLI из builder (надёжнее npm install в slim standalone)
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/effect ./node_modules/effect
COPY --from=builder /app/node_modules/c12 ./node_modules/c12
COPY --from=builder /app/node_modules/deepmerge-ts ./node_modules/deepmerge-ts
COPY --from=builder /app/node_modules/empathic ./node_modules/empathic

USER root
RUN mkdir -p node_modules/.bin \
	&& ln -sf ../prisma/build/index.js node_modules/.bin/prisma \
	&& chmod +x node_modules/prisma/build/index.js 2>/dev/null || true

ENV NODE_ENV=production

# Устанавливаем права
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
