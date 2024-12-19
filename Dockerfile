FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем необходимые инструменты
RUN apk add --no-cache curl netcat-openbsd wget && \
    wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-linux-x86_64-100.7.3.tgz && \
    tar -zxvf mongodb-database-tools-linux-x86_64-100.7.3.tgz && \
    mv mongodb-database-tools-linux-x86_64-100.7.3/bin/* /usr/local/bin/ && \
    rm -rf mongodb-database-tools-linux-x86_64-100.7.3.tgz mongodb-database-tools-linux-x86_64-100.7.3

# Копируем package.json 
COPY package*.json ./

# Очистка кэша npm перед установкой зависимостей
RUN npm cache clean --force && npm install

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