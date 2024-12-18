#!/bin/sh

echo "Starting initialization script..."

# Wait for MongoDB to start
echo "Waiting for MongoDB to start..."
while ! nc -z mongodb 27017; do
    echo "MongoDB is unavailable - sleeping"
    sleep 2
done

echo "MongoDB is up - executing initialization"

# Initialize data
echo "Initializing categories..."
node src/scripts/init-categories.mjs
echo "Categories initialization completed"

echo "Initializing phones..."
node src/scripts/init-phones.mjs
echo "Phones initialization completed"

# Build Next.js application
echo "Building Next.js application..."
npm run build

# Start Next.js application
echo "Starting Next.js application..."
npm run start
