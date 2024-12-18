#!/bin/sh

# Ждем, пока MongoDB будет готова
echo "Waiting for MongoDB to start..."
sleep 20

# Проверяем доступность MongoDB
echo "Checking MongoDB connection..."
until nc -z mongodb 27017; do
    echo "MongoDB is unavailable - sleeping"
    sleep 2
done

echo "MongoDB is up - executing initialization"

# Инициализируем данные
echo "Initializing categories..."
node src/scripts/init-categories.mjs
echo "Categories initialization completed"

echo "Initializing phones..."
node src/scripts/init-phones.mjs
echo "Phones initialization completed"

# Запускаем Next.js приложение
echo "Starting Next.js application..."
npm run start
