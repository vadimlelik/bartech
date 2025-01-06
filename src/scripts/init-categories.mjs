import { MongoClient } from 'mongodb';

const categories = [
  {
    id: 'iphone',
    name: 'iPhone',
    description: 'Смартфоны Apple iPhone',
    imageUrl: '/images/categories/iphone.webp',
    filters: {
      brands: ['Apple'],
      memories: ['64GB', '128GB', '256GB', '512GB', '1TB'],
      rams: ['4GB', '6GB', '8GB'],
      processors: ['A15 Bionic', 'A16 Bionic', 'A17 Pro'],
      displays: ['6.1"', '6.7"'],
      colors: ['Space Black', 'Silver', 'Gold', 'Natural Titanium'],
      conditions: ['New', 'Like New', 'Used'],
      os: ['iOS 16', 'iOS 17'],
      batteries: ['3000mAh', '3200mAh', '4400mAh'],
      cameras: ['12MP', '48MP'],
    },
    metadata: {
      title: 'iPhone - Купить iPhone в Bartech',
      description:
        'Широкий выбор iPhone. Все модели в наличии. Быстрая доставка.',
      keywords: 'iPhone, Apple, смартфон, купить iPhone',
    },
    sortOptions: ['price', 'name', 'year'],
    featured: true,
    order: 1,
  },
  {
    id: 'samsung',
    name: 'Samsung',
    description: 'Смартфоны Samsung Galaxy',
    imageUrl: '/images/categories/samsung.webp',
    filters: {
      brands: ['Samsung'],
      memories: ['128GB', '256GB', '512GB'],
      rams: ['6GB', '8GB', '12GB'],
      processors: ['Snapdragon 8 Gen 2', 'Exynos 2200'],
      displays: ['6.1"', '6.6"', '6.8"'],
      colors: ['Phantom Black', 'Cream', 'Green', 'Lavender'],
      conditions: ['New', 'Like New', 'Used'],
      os: ['Android 13', 'Android 14'],
      batteries: ['3700mAh', '4500mAh', '5000mAh'],
      cameras: ['12MP', '50MP', '108MP'],
    },
    metadata: {
      title: 'Samsung - Купить Samsung в Bartech',
      description:
        'Широкий выбор Samsung Galaxy. Все модели в наличии. Быстрая доставка.',
      keywords: 'Samsung, Galaxy, смартфон, купить Samsung',
    },
    sortOptions: ['price', 'name', 'year'],
    featured: true,
    order: 2,
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    description: 'Смартфоны Xiaomi',
    imageUrl: '/images/categories/xiaomi.webp',
    filters: {
      brands: ['Xiaomi', 'Redmi', 'POCO'],
      memories: ['64GB', '128GB', '256GB'],
      rams: ['4GB', '6GB', '8GB', '12GB'],
      processors: ['Snapdragon 8 Gen 2', 'Dimensity 9200'],
      displays: ['6.28"', '6.36"', '6.67"'],
      colors: ['Black', 'Blue', 'White', 'Green'],
      conditions: ['New', 'Like New', 'Used'],
      os: ['MIUI 14', 'MIUI 15'],
      batteries: ['4500mAh', '5000mAh', '5500mAh'],
      cameras: ['48MP', '50MP', '108MP', '200MP'],
    },
    metadata: {
      title: 'Xiaomi - Купить Xiaomi в Bartech',
      description:
        'Широкий выбор Xiaomi. Все модели в наличии. Быстрая доставка.',
      keywords: 'Xiaomi, Redmi, POCO, смартфон, купить Xiaomi',
    },
    sortOptions: ['price', 'name', 'year'],
    featured: true,
    order: 3,
  },
];

async function initCategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bartech';
  const client = new MongoClient(uri);

  try {
    await client.connect()('Connected to MongoDB');

    const db = client.db('bartech');

    // Проверяем существование коллекции
    const collections = await db.listCollections().toArray();
    if (!collections.find((c) => c.name === 'categories')) {
      await db.createCollection('categories')('Created categories collection');
    }

    // Проверяем, есть ли уже категории
    const existingCategories = await db
      .collection('categories')
      .countDocuments();

    if (existingCategories === 0) {
      // Добавляем категории только если их нет
      const result = await db.collection('categories').insertMany(categories)(
        `Successfully initialized ${result.insertedCount} categories`
      );
    } else {
      ('Categories already exist, skipping initialization');
    }
  } catch (error) {
    'Error initializing categories:', error;
  } finally {
    await client.close()('Disconnected from MongoDB');
  }
}

// Запускаем инициализацию
initCategories();
