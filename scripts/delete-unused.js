import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем список неиспользуемых файлов
const unusedImages = JSON.parse(fs.readFileSync('scripts/unused-images.json', 'utf8'));

const publicDir = path.join(process.cwd(), 'public');

let deleted = 0;
let errors = 0;

console.log(`Удаление ${unusedImages.length} неиспользуемых файлов...\n`);

unusedImages.forEach((imgPath) => {
  // Преобразуем путь из Windows формата
  const fullPath = path.join(publicDir, imgPath.replace(/^\//, '').replace(/\//g, path.sep));
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`Удален: ${imgPath}`);
      deleted++;
    } catch (error) {
      console.error(`Ошибка при удалении ${imgPath}:`, error.message);
      errors++;
    }
  } else {
    console.log(`Файл не найден: ${imgPath}`);
  }
});

console.log(`\nУдалено: ${deleted}`);
console.log(`Ошибок: ${errors}`);

// Удаляем пустые папки
console.log('\nПроверка пустых папок...');

function removeEmptyDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath);
  
  if (files.length === 0) {
    fs.rmdirSync(dirPath);
    console.log(`Удалена пустая папка: ${dirPath.replace(publicDir, '')}`);
    return true;
  }
  
  let allRemoved = true;
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (removeEmptyDirs(filePath)) {
        // После удаления подпапки проверяем текущую папку снова
        const remainingFiles = fs.readdirSync(dirPath);
        if (remainingFiles.length === 0) {
          fs.rmdirSync(dirPath);
          console.log(`Удалена пустая папка: ${dirPath.replace(publicDir, '')}`);
        }
      } else {
        allRemoved = false;
      }
    } else {
      allRemoved = false;
    }
  });
  
  return allRemoved;
}

// Удаляем пустые папки в images
const imagesDir = path.join(publicDir, 'images');
if (fs.existsSync(imagesDir)) {
  removeEmptyDirs(imagesDir);
}

// Проверяем папку uploads - если она пустая или содержит только неиспользуемые файлы, можно удалить
const uploadsDir = path.join(publicDir, 'uploads');
if (fs.existsSync(uploadsDir)) {
  const uploadsFiles = [];
  function getAllUploadsFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllUploadsFiles(filePath);
      } else {
        uploadsFiles.push(filePath);
      }
    });
  }
  getAllUploadsFiles(uploadsDir);
  
  if (uploadsFiles.length === 0) {
    fs.rmdirSync(uploadsDir, { recursive: true });
    console.log('Удалена пустая папка uploads');
  }
}

console.log('\nГотово!');

