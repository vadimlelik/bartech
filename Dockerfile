FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код приложения
COPY . .

# Передаём переменные окружения как аргументы
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PHONE

# Устанавливаем переменные окружения
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PHONE=$NEXT_PUBLIC_PHONE

# Устанавливаем переменную для продакшн-режима
ENV NODE_ENV=production

# Собираем приложение
RUN npm run build

# Команда для запуска приложения
CMD ["npm", "start"]

# Открываем порт 3000
EXPOSE 3000