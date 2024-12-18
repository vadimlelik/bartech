#!/bin/sh

echo "Starting initialization script..."

# Increase MongoDB wait time and add better error handling
echo "Waiting for MongoDB to start..."
MAX_TRIES=30
COUNT=0
while ! nc -z mongodb 27017; do
    echo "MongoDB is unavailable - attempt $COUNT of $MAX_TRIES"
    COUNT=$((COUNT + 1))
    if [ $COUNT -eq $MAX_TRIES ]; then
        echo "Error: MongoDB failed to start after $MAX_TRIES attempts"
        exit 1
    fi
    sleep 3
done

echo "MongoDB is up - executing initialization"

# Check environment variables
echo "Checking environment variables..."
if [ -z "$MONGODB_URI" ]; then
    echo "Error: MONGODB_URI is not set"
    exit 1
fi
if [ -z "$NODE_ENV" ]; then
    echo "Error: NODE_ENV is not set"
    exit 1
fi

echo "MONGODB_URI: $MONGODB_URI"
echo "NODE_ENV: $NODE_ENV"

# Initialize data with error handling
echo "Initializing categories..."
if ! node src/scripts/init-categories.mjs; then
    echo "Error: Failed to initialize categories"
    exit 1
fi
echo "Categories initialization completed"

echo "Initializing phones..."
if ! node src/scripts/init-phones.mjs; then
    echo "Error: Failed to initialize phones"
    exit 1
fi
echo "Phones initialization completed"

# Clean and prepare for build
echo "Cleaning previous build..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies if needed
echo "Installing dependencies..."
npm install

# Build Next.js application
echo "Building Next.js application..."
if ! npm run build; then
    echo "Error: Failed to build Next.js application"
    exit 1
fi

# Start Next.js application
echo "Starting Next.js application..."
exec npm run start
