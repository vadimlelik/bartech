# --- build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# Устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем проект и собираем
COPY . .
RUN npm run build

# --- production stage ---
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Устанавливаем только production-зависимости
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Копируем нужные артефакты из builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]
