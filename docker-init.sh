#!/bin/sh

# Ждем, пока MongoDB будет готова
echo "Waiting for MongoDB to be ready..."
sleep 10

# Запускаем скрипты инициализации
echo "Initializing database..."
node src/scripts/init-categories.mjs
node src/scripts/init-phones.mjs

# Запускаем приложение
echo "Starting Next.js application..."
npm start
