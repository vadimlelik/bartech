import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем данные из JSON файлов
const productsData = JSON.parse(fs.readFileSync('data/products_new.json', 'utf8'));
const categoriesData = JSON.parse(fs.readFileSync('data/categories.json', 'utf8'));

// Собираем все используемые изображения
const usedImages = new Set();

// Из products
productsData.forEach(product => {
  if (product.image) usedImages.add(product.image);
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => usedImages.add(img));
  }
});

// Из categories
categoriesData.forEach(category => {
  if (category.image && !category.image.startsWith('http')) {
    usedImages.add(category.image);
  }
});

console.log('Используемые изображения:', Array.from(usedImages).length);
console.log(JSON.stringify(Array.from(usedImages).sort(), null, 2));

// Функция для нормализации имени файла
function normalizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_\.]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Функция для получения бренда из пути
function getBrandFromPath(imagePath) {
  const pathParts = imagePath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  
  // Проверяем известные бренды
  const brands = ['apple', 'iphone', 'samsung', 'huawei', 'honor', 'xiaomi', 'poco', 'infinix', 'google', 'pixel', 'oneplus', 'nothing'];
  
  for (const brand of brands) {
    if (fileName.toLowerCase().includes(brand)) {
      if (brand === 'iphone') return 'apple';
      if (brand === 'pixel') return 'google';
      return brand;
    }
  }
  
  // Проверяем папки
  if (pathParts.includes('honor')) return 'honor';
  if (pathParts.includes('huawei')) return 'huawei';
  if (pathParts.includes('infinix')) return 'infinix';
  if (pathParts.includes('POCO')) return 'poco';
  if (pathParts.includes('xiaomi')) return 'xiaomi';
  
  return 'other';
}

// Создаем маппинг старых путей на новые
const imageMapping = {};

usedImages.forEach(oldPath => {
  const fileName = path.basename(oldPath);
  const brand = getBrandFromPath(oldPath);
  const normalizedName = normalizeFileName(fileName);
  
  // Определяем тип изображения
  let newPath;
  if (oldPath.includes('/categories/')) {
    newPath = `/images/categories/${normalizedName}`;
  } else if (brand !== 'other') {
    newPath = `/images/products/${brand}/${normalizedName}`;
  } else {
    newPath = `/images/products/${normalizedName}`;
  }
  
  imageMapping[oldPath] = newPath;
});

console.log('\nМаппинг путей:');
console.log(JSON.stringify(imageMapping, null, 2));

// Сохраняем маппинг в файл
fs.writeFileSync('scripts/image-mapping.json', JSON.stringify(imageMapping, null, 2));

