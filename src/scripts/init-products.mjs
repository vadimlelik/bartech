import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import clientPromise from '../lib/mongodb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../../.env.local') });

const brandSpecs = {
  apple: {
    processors: ['Apple A15 Bionic', 'Apple A16 Bionic', 'Apple A17 Pro'],
    displays: ['Super Retina XDR OLED', 'Super Retina XDR ProMotion'],
    displaySizes: ['6.1"', '6.7"'],
    refreshRates: ['60Hz', '120Hz'],
    rams: ['6GB', '8GB'],
    memories: ['128GB', '256GB', '512GB', '1TB'],
    cameras: ['12MP + 12MP', '48MP + 12MP + 12MP'],
    batteries: ['3000mAh', '3200mAh', '4000mAh', '4400mAh'],
    chargingSpeeds: ['20W', '25W'],
    wirelessCharging: ['15W MagSafe', '7.5W Qi'],
    waterResistance: ['IP68'],
    security: ['Face ID'],
    os: ['iOS 17'],
    colors: [
      'Space Black',
      'Silver',
      'Gold',
      'Natural Titanium',
      'Blue Titanium',
      'White Titanium',
      'Black Titanium',
    ],
  },
  samsung: {
    processors: ['Snapdragon 8 Gen 2', 'Snapdragon 8 Gen 3', 'Exynos 2200'],
    displays: ['Dynamic AMOLED 2X', 'Super AMOLED'],
    displaySizes: ['6.1"', '6.4"', '6.7"', '6.8"'],
    refreshRates: ['60Hz', '120Hz'],
    rams: ['8GB', '12GB'],
    memories: ['128GB', '256GB', '512GB', '1TB'],
    cameras: ['50MP + 12MP + 12MP', '200MP + 12MP + 12MP'],
    batteries: ['4000mAh', '4500mAh', '5000mAh'],
    chargingSpeeds: ['25W', '45W'],
    wirelessCharging: ['15W', '10W'],
    waterResistance: ['IP68'],
    security: ['Ultrasonic Fingerprint', 'Face Recognition'],
    os: ['Android 14 (One UI 6)'],
    colors: ['Phantom Black', 'Cream', 'Green', 'Lavender', 'Graphite'],
  },
  xiaomi: {
    processors: ['Snapdragon 8 Gen 2', 'Dimensity 9000', 'Dimensity 9200'],
    displays: ['AMOLED', 'Super AMOLED'],
    displaySizes: ['6.4"', '6.7"', '6.8"'],
    refreshRates: ['90Hz', '120Hz', '144Hz'],
    rams: ['8GB', '12GB', '16GB'],
    memories: ['128GB', '256GB', '512GB'],
    cameras: [
      '50MP + 48MP + 12MP',
      '108MP + 12MP + 12MP',
      '200MP + 48MP + 12MP',
    ],
    batteries: ['4500mAh', '5000mAh', '5500mAh'],
    chargingSpeeds: ['67W', '120W'],
    wirelessCharging: ['50W', '30W'],
    waterResistance: ['IP68', 'IP67'],
    security: ['In-display Fingerprint', 'Face Recognition'],
    os: ['Android 14 (MIUI 15)'],
    colors: ['Black', 'Blue', 'White', 'Green'],
  },
  honor: {
    processors: ['Snapdragon 8 Gen 2', 'Dimensity 9000'],
    displays: ['OLED', 'AMOLED'],
    displaySizes: ['6.4"', '6.7"', '6.8"'],
    refreshRates: ['90Hz', '120Hz'],
    rams: ['8GB', '12GB'],
    memories: ['128GB', '256GB', '512GB'],
    cameras: ['50MP + 12MP + 12MP', '108MP + 12MP + 8MP'],
    batteries: ['4500mAh', '5000mAh'],
    chargingSpeeds: ['66W', '100W'],
    wirelessCharging: ['50W', 'Нет'],
    waterResistance: ['IP68', 'IP67'],
    security: ['In-display Fingerprint', 'Face Recognition'],
    os: ['Android 14 (Magic UI 7)'],
    colors: [
      'Emerald Green',
      'Midnight Black',
      'Icelandic Frost',
      'Ocean Blue',
    ],
  },
  huawei: {
    processors: ['Kirin 9000', 'Snapdragon 8 Gen 2 4G'],
    displays: ['OLED', 'LTPO OLED'],
    displaySizes: ['6.4"', '6.7"', '6.8"'],
    refreshRates: ['90Hz', '120Hz'],
    rams: ['8GB', '12GB'],
    memories: ['256GB', '512GB'],
    cameras: ['50MP + 48MP + 12MP', '108MP + 12MP + 12MP'],
    batteries: ['4500mAh', '5000mAh'],
    chargingSpeeds: ['66W', '88W'],
    wirelessCharging: ['50W', '40W'],
    waterResistance: ['IP68'],
    security: ['In-display Fingerprint', 'Face Recognition'],
    os: ['HarmonyOS 4.0'],
    colors: ['Black', 'Silver', 'Gold', 'White'],
  },
};

// Функция для генерации случайной цены в заданном диапазоне
function generatePrice(min, max, step = 990) {
  return Math.floor((Math.random() * (max - min) + min) / step) * step;
}

// Функция для получения случайного элемента из массива
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Функция для генерации уникального имени модели
function generateModelName(category, index) {
  const year = 2023 + Math.floor(Math.random() * 2);
  const series = ['Pro', 'Ultra', 'Plus', 'Max', 'Lite', ''][
    Math.floor(Math.random() * 6)
  ];

  switch (category) {
    case 'apple':
      return `iPhone ${14 + Math.floor(Math.random() * 2)} ${series}`.trim();
    case 'samsung':
      return `Galaxy S${23 + Math.floor(Math.random() * 2)} ${series}`.trim();
    case 'xiaomi':
      return `Xiaomi ${
        13 + Math.floor(Math.random() * 2)
      }${series} ${year}`.trim();
    case 'honor':
      return `Honor ${90 + Math.floor(Math.random() * 10)} ${series}`.trim();
    case 'huawei':
      return `Huawei P${60 + Math.floor(Math.random() * 5)} ${series}`.trim();
    default:
      return `Model ${index}`;
  }
}

// Функция для генерации описания на основе характеристик
function generateDescription(specs, brand) {
  const brandName = {
    apple: 'iPhone',
    samsung: 'Galaxy',
    xiaomi: 'Xiaomi',
    honor: 'Honor',
    huawei: 'Huawei',
  }[brand];

  const highlights = [
    `Великолепный ${specs.display} дисплей ${specs.displaySize} с частотой обновления ${specs.refreshRate}`,
    `Мощный ${specs.processor} для максимальной производительности`,
    `Профессиональная камера ${specs.camera} для идеальных снимков`,
    `Батарея ${specs.battery} с быстрой зарядкой ${specs.chargingSpeed}`,
    specs.wirelessCharging !== 'Нет'
      ? `Поддержка беспроводной зарядки ${specs.wirelessCharging}`
      : null,
    specs.waterResistance !== 'Нет'
      ? `Защита от воды и пыли ${specs.waterResistance}`
      : null,
    `Безопасность: ${specs.security}`,
    brand === 'apple' ? 'Поддержка экосистемы Apple' : null,
    brand === 'huawei' ? 'Фирменные сервисы Huawei' : null,
    `Работает на ${specs.os}`,
  ].filter(Boolean);

  return `${brandName} - ${highlights.join('. ')}.`;
}

// Генерация продуктов
function generateProducts(count = 1000) {
  const products = [];
  const categories = Object.keys(brandSpecs);
  const productsPerCategory = Math.floor(count / categories.length);

  categories.forEach((category) => {
    const specs = brandSpecs[category];

    for (let i = 0; i < productsPerCategory; i++) {
      const memory = getRandomItem(specs.memories);
      const ram = getRandomItem(specs.rams);
      const color = getRandomItem(specs.colors);

      const specifications = {
        brand: category,
        model: generateModelName(category, i),
        storage: memory,
        memory: memory,
        ram: ram,
        processor: getRandomItem(specs.processors),
        display: getRandomItem(specs.displays),
        camera: getRandomItem(specs.cameras),
        battery: getRandomItem(specs.batteries),
        os: getRandomItem(specs.os),
        color: color,
        condition: getRandomItem(['New', 'Used', 'Refurbished']),
        year: String(2020 + Math.floor(Math.random() * 4)),
      };

      // Генерация вариантов с разными цветами и ценами
      const variants = specs.colors
        .slice(0, 3 + Math.floor(Math.random() * 3)) // 3-5 цветов для каждой модели
        .map((variantColor) => ({
          color: variantColor,
          model: memory,
          price: generatePrice(
            category === 'apple' ? 69990 : 29990,
            category === 'apple' ? 199990 : 149990
          ),
        }));

      products.push({
        id: `${category}-${i + 1}`,
        name: specifications.model,
        categoryId: category,
        variants,
        specifications,
        description: generateDescription(specifications, category),
        imageUrl: `/images/${category}-phone.jpg`,
        image: `/images/${category}-phone.jpg`,
        additionalImages: [
          `/images/${category}-phone-2.jpg`,
          `/images/${category}-phone-3.jpg`,
        ],
      });
    }
  });

  return products;
}

const categories = [
  {
    id: 'apple',
    name: 'Apple',
    description:
      'Инновационные iPhone смартфоны с передовыми технологиями и экосистемой Apple',
    imageUrl: '/images/apple-category.jpg',
  },
  {
    id: 'samsung',
    name: 'Samsung',
    description:
      'Флагманские Galaxy смартфоны с превосходными камерами и дисплеями',
    imageUrl: '/images/samsung-category.jpg',
  },
  {
    id: 'honor',
    name: 'Honor',
    description:
      'Современные смартфоны с отличным соотношением цены и качества',
    imageUrl: '/images/honor-category.jpg',
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    description: 'Инновационные смартфоны с мощным железом и доступными ценами',
    imageUrl: '/images/xiaomi-category.jpg',
  },
  {
    id: 'huawei',
    name: 'Huawei',
    description:
      'Премиальные смартфоны с передовыми технологиями и камерами Leica',
    imageUrl: '/images/huawei-category.jpg',
  },
];

// Генерируем 1000 продуктов
const products = generateProducts(1000);

async function initDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('bartech');

    // Очищаем существующие коллекции
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});

    // Добавляем категории
    await db.collection('categories').insertMany(categories)(
      'Categories initialized'
    );

    // Добавляем продукты
    await db.collection('products').insertMany(products)(
      'Products initialized'
    )('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    'Error initializing database:', error;
    process.exit(1);
  }
}

initDatabase();
