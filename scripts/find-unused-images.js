import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для рекурсивного получения всех файлов
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      // Проверяем только изображения
      if (/\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(file)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Функция для поиска использования файла в коде
function searchInFiles(filePath, searchPaths) {
  const relativePath = filePath.replace(/\\/g, '/').replace(/^public\//, '/');
  const fileName = path.basename(filePath);
  const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
  
  const searchTerms = [
    relativePath,
    fileName,
    fileNameWithoutExt,
  ];

  for (const searchPath of searchPaths) {
    if (!fs.existsSync(searchPath)) continue;
    
    const content = fs.readFileSync(searchPath, 'utf8');
    for (const term of searchTerms) {
      if (content.includes(term)) {
        return true;
      }
    }
  }
  return false;
}

// Получаем все изображения в public
const publicDir = path.join(process.cwd(), 'public');
const allImages = getAllFiles(publicDir);

// Исключаем системные файлы (favicon, manifest и т.д.)
const systemFiles = [
  'favicon',
  'manifest',
  'apple-touch-icon',
  'logo',
  'icon',
];

const imageFiles = allImages.filter(img => {
  const fileName = path.basename(img).toLowerCase();
  return !systemFiles.some(sys => fileName.includes(sys));
});

console.log(`Найдено ${imageFiles.length} изображений для проверки\n`);

// Получаем все файлы для поиска
const searchFiles = [];
function getAllCodeFiles(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Пропускаем node_modules и .next
      if (!['node_modules', '.next', '.git'].includes(file)) {
        getAllCodeFiles(filePath);
      }
    } else {
      if (/\.(js|jsx|ts|tsx|json|css)$/i.test(file)) {
        searchFiles.push(filePath);
      }
    }
  });
}

// Ищем в src и data
if (fs.existsSync('src')) getAllCodeFiles('src');
if (fs.existsSync('data')) getAllCodeFiles('data');

console.log(`Проверка использования в ${searchFiles.length} файлах...\n`);

// Проверяем каждое изображение
const unusedImages = [];
const usedImages = [];

imageFiles.forEach((imgPath) => {
  const relativePath = imgPath.replace(/\\/g, '/').replace(/^public\//, '/');
  
  if (searchInFiles(imgPath, searchFiles)) {
    usedImages.push(relativePath);
  } else {
    unusedImages.push(relativePath);
  }
});

console.log(`Используется: ${usedImages.length}`);
console.log(`Не используется: ${unusedImages.length}\n`);

if (unusedImages.length > 0) {
  console.log('Неиспользуемые изображения:');
  unusedImages.forEach(img => console.log(`  ${img}`));
  
  // Сохраняем список в файл
  fs.writeFileSync('scripts/unused-images.json', JSON.stringify(unusedImages, null, 2));
  console.log('\nСписок сохранен в scripts/unused-images.json');
}

