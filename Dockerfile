FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код приложения
COPY . .

# Делаем скрипт инициализации исполняемым
RUN chmod +x docker-init.sh

# Передаём переменные окружения как аргументы
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PHONE
ARG MONGODB_URI

# Устанавливаем переменные окружения
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PHONE=$NEXT_PUBLIC_PHONE
ENV MONGODB_URI=$MONGODB_URI
ENV NODE_ENV=production

# Собираем приложение
RUN npm run build

# Команда для запуска приложения с инициализацией
CMD ["./docker-init.sh"]

# Открываем порт 3000
EXPOSE 3000