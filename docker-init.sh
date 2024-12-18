#!/bin/sh

# Ждем, пока MongoDB будет готова
echo "Waiting for MongoDB to start..."
sleep 20

# Инициализируем данные
echo "Checking MongoDB connection..."
until mongosh --eval "db.adminCommand('ping')" mongodb://mongodb:27017/bartech; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done

echo "Initializing categories..."
node src/scripts/init-categories.mjs

echo "Initializing phones..."
node src/scripts/init-phones.mjs

# Запускаем Next.js приложение
echo "Starting Next.js application..."
npm run start
