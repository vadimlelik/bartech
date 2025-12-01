import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем маппинг
const mapping = JSON.parse(fs.readFileSync('scripts/image-mapping.json', 'utf8'));

// Читаем products_new.json
const productsData = JSON.parse(fs.readFileSync('data/products_new.json', 'utf8'));

// Функция для замены пути
function replacePath(oldPath) {
  if (!oldPath || oldPath.startsWith('http')) {
    return oldPath; // Не трогаем URL и пустые значения
  }
  return mapping[oldPath] || oldPath;
}

// Обновляем пути в продуктах
let updated = 0;
productsData.forEach(product => {
  if (product.image) {
    const newPath = replacePath(product.image);
    if (newPath !== product.image) {
      product.image = newPath;
      updated++;
    }
  }
  
  if (product.images && Array.isArray(product.images)) {
    product.images = product.images.map(img => {
      const newPath = replacePath(img);
      if (newPath !== img) {
        updated++;
      }
      return newPath;
    });
  }
});

// Сохраняем обновленный файл
fs.writeFileSync('data/products_new.json', JSON.stringify(productsData, null, 2));

console.log(`Обновлено ${updated} путей в products_new.json`);

