#!/bin/sh

echo "Starting initialization script..."

# Ждем, пока MongoDB будет готова
echo "Waiting for MongoDB to start..."
sleep 20

# Проверяем доступность MongoDB
echo "Checking MongoDB connection..."
while ! nc -z mongodb 27017; do
    echo "MongoDB is unavailable - sleeping"
    sleep 2
done

echo "MongoDB is up - executing initialization"

# Проверяем переменные окружения
echo "Checking environment variables..."
echo "MONGODB_URI: $MONGODB_URI"
echo "NODE_ENV: $NODE_ENV"

# Инициализируем данные
echo "Initializing categories..."
node src/scripts/init-categories.mjs
echo "Categories initialization completed"

echo "Initializing phones..."
node src/scripts/init-phones.mjs
echo "Phones initialization completed"

# Проверяем, что Next.js собран
echo "Checking Next.js build..."
if [ ! -d ".next" ]; then
    echo "Building Next.js application..."
    npm run build
fi

# Запускаем Next.js приложение
echo "Starting Next.js application..."
npm run start
