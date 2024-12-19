#!/bin/sh

echo "Starting initialization script..."

# Wait for MongoDB to start
echo "Waiting for MongoDB to start..."
while ! nc -z mongodb 27017; do
    echo "MongoDB is unavailable - sleeping"
    sleep 2
done

echo "MongoDB is up - executing initialization"

echo "Importing initial data..."
# Import categories
mongoimport --uri $MONGODB_URI --collection categories --file /app/data/categories.json --jsonArray
echo "Categories imported successfully"

# Import products
mongoimport --uri $MONGODB_URI --collection products --file /app/data/products.json --jsonArray
echo "Products imported successfully"

# Start Next.js application
echo "Starting Next.js application..."
npm start
