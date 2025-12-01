import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем список неиспользуемых файлов
const unusedImages = JSON.parse(fs.readFileSync('scripts/unused-images.json', 'utf8'));

const publicDir = path.join(process.cwd(), 'public');

let deleted = 0;
let notFound = 0;

console.log(`Удаление ${unusedImages.length} неиспользуемых файлов...\n`);

unusedImages.forEach((imgPath) => {
  // Убираем префикс C:/Users/.../public/ и оставляем только относительный путь
  let relativePath = imgPath;
  if (imgPath.includes('public/')) {
    relativePath = '/' + imgPath.split('public/')[1].replace(/\\/g, '/');
  } else if (imgPath.startsWith('/')) {
    relativePath = imgPath;
  } else {
    relativePath = '/' + imgPath.replace(/\\/g, '/');
  }
  
  // Убираем ведущий слэш для path.join
  const pathParts = relativePath.replace(/^\//, '').split('/');
  const fullPath = path.join(publicDir, ...pathParts);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`✓ Удален: ${relativePath}`);
      deleted++;
    } catch (error) {
      console.error(`✗ Ошибка при удалении ${relativePath}:`, error.message);
    }
  } else {
    // Попробуем найти файл с другим регистром или в другом месте
    const fileName = path.basename(fullPath);
    const dir = path.dirname(fullPath);
    
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const found = files.find(f => f.toLowerCase() === fileName.toLowerCase());
      if (found) {
        try {
          fs.unlinkSync(path.join(dir, found));
          console.log(`✓ Удален (найден с другим регистром): ${relativePath}`);
          deleted++;
        } catch (error) {
          console.error(`✗ Ошибка:`, error.message);
        }
      } else {
        console.log(`- Не найден: ${relativePath}`);
        notFound++;
      }
    } else {
      console.log(`- Папка не существует: ${path.dirname(relativePath)}`);
      notFound++;
    }
  }
});

console.log(`\n✓ Удалено: ${deleted}`);
console.log(`- Не найдено: ${notFound}`);

// Удаляем пустые папки
console.log('\nПроверка пустых папок...');

function removeEmptyDirs(dirPath, basePath) {
  if (!fs.existsSync(dirPath)) return false;
  
  const files = fs.readdirSync(dirPath);
  
  if (files.length === 0) {
    fs.rmdirSync(dirPath);
    const relativePath = dirPath.replace(basePath, '').replace(/\\/g, '/');
    console.log(`✓ Удалена пустая папка: ${relativePath}`);
    return true;
  }
  
  let allRemoved = true;
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (removeEmptyDirs(filePath, basePath)) {
        // После удаления подпапки проверяем текущую папку снова
        const remainingFiles = fs.readdirSync(dirPath);
        if (remainingFiles.length === 0) {
          fs.rmdirSync(dirPath);
          const relativePath = dirPath.replace(basePath, '').replace(/\\/g, '/');
          console.log(`✓ Удалена пустая папка: ${relativePath}`);
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
  removeEmptyDirs(imagesDir, publicDir);
}

// Проверяем старые папки, которые могли остаться пустыми
const oldDirs = [
  path.join(publicDir, 'images', 'honor'),
  path.join(publicDir, 'images', 'huawei'),
  path.join(publicDir, 'images', 'infinix'),
  path.join(publicDir, 'images', 'POCO'),
  path.join(publicDir, 'images', 'xiaomi'),
  path.join(publicDir, 'uploads', 'categories'),
];

oldDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      fs.rmdirSync(dir);
      const relativePath = dir.replace(publicDir, '').replace(/\\/g, '/');
      console.log(`✓ Удалена пустая папка: ${relativePath}`);
    }
  }
});

// Проверяем папку uploads - если она пустая, удаляем
const uploadsDir = path.join(publicDir, 'uploads');
if (fs.existsSync(uploadsDir)) {
  try {
    const files = fs.readdirSync(uploadsDir);
    if (files.length === 0) {
      fs.rmdirSync(uploadsDir);
      console.log('✓ Удалена пустая папка: /uploads');
    }
  } catch (error) {
    // Игнорируем ошибки
  }
}

console.log('\n✓ Готово!');

