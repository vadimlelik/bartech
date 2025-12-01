import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(process.cwd(), 'public');

// Проверяем, используются ли файлы из uploads
function isFileUsed(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = filePath.replace(publicDir, '').replace(/\\/g, '/');
  const uploadsPath = relativePath;
  const imagesPath = relativePath.replace('/uploads/', '/images/');
  
  const searchDirs = ['src', 'data'];
  
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    
    function searchInDir(dirPath) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          if (!['node_modules', '.next'].includes(file)) {
            if (searchInDir(fullPath)) return true;
          }
        } else {
          if (/\.(js|jsx|ts|tsx|json)$/i.test(file)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (content.includes(uploadsPath) || content.includes(imagesPath)) {
                return true;
              }
            } catch (e) {
              // Игнорируем ошибки
            }
          }
        }
      }
      return false;
    }
    
    if (searchInDir(dir)) {
      return true;
    }
  }
  
  return false;
}

console.log('Финальная очистка...\n');

// Проверяем файлы в uploads/categories
const uploadsCategoriesDir = path.join(publicDir, 'uploads', 'categories');
if (fs.existsSync(uploadsCategoriesDir)) {
  const files = fs.readdirSync(uploadsCategoriesDir);
  console.log(`Найдено ${files.length} файлов в uploads/categories`);
  
  files.forEach(file => {
    const filePath = path.join(uploadsCategoriesDir, file);
    const relativePath = filePath.replace(publicDir, '').replace(/\\/g, '/');
    
    if (!isFileUsed(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`  ✓ Удален дубликат: ${relativePath}`);
      } catch (error) {
        console.log(`  ✗ Ошибка: ${relativePath}`);
      }
    } else {
      console.log(`  - Используется: ${relativePath}`);
    }
  });
  
  // Проверяем, пуста ли папка
  const remainingFiles = fs.readdirSync(uploadsCategoriesDir);
  if (remainingFiles.length === 0) {
    fs.rmdirSync(uploadsCategoriesDir);
    console.log('  ✓ Удалена пустая папка: /uploads/categories');
    
    // Проверяем папку uploads
    const uploadsDir = path.join(publicDir, 'uploads');
    const uploadsContents = fs.readdirSync(uploadsDir);
    if (uploadsContents.length === 0) {
      fs.rmdirSync(uploadsDir);
      console.log('  ✓ Удалена пустая папка: /uploads');
    }
  }
}

console.log('\n✓ Готово!');

