FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json 
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Собираем приложение
RUN npm run build

# Продакшн образ
FROM node:18-alpine

WORKDIR /app

# Копируем необходимые файлы из билд-стейджа
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
COPY --from=builder /app/node_modules ./node_modules

# Устанавливаем только production зависимости
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://178.172.138.214

# Команда для запуска приложения
CMD ["npm", "start"]

# Открываем порт 3000
EXPOSE 3000