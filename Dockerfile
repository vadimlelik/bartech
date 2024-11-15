FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Передаем переменные окружения как аргументы
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Устанавливаем переменную для продакшн-режима
ENV NODE_ENV=production

# Собираем приложение
RUN npm run build

# Команда для запуска приложения
CMD ["npm", "start"]

# Открываем порт 3000
EXPOSE 3000