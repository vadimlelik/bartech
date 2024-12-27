FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://178.172.138.214

# Собираем приложение
RUN npm run build

# Открываем порт 3000
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]