import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(process.cwd(), 'public');

// Функция для проверки использования файла
function isFileUsed(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = filePath.replace(publicDir, '').replace(/\\/g, '/');
  
  // Ищем в коде
  const searchDirs = ['src', 'data'];
  const searchTerms = [relativePath, fileName];
  
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    
    function searchInDir(dirPath) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          if (!['node_modules', '.next'].includes(file)) {
            searchInDir(fullPath);
          }
        } else {
          if (/\.(js|jsx|ts|tsx|json)$/i.test(file)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              for (const term of searchTerms) {
                if (content.includes(term)) {
                  return true;
                }
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

// Старые папки, которые нужно проверить
const oldDirs = [
  path.join(publicDir, 'images', 'honor'),
  path.join(publicDir, 'images', 'infinix'),
  path.join(publicDir, 'images', 'POCO'),
];

console.log('Проверка старых папок...\n');

oldDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  const unusedFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isFile()) {
      if (!isFileUsed(filePath)) {
        unusedFiles.push(filePath);
      }
    }
  });
  
  if (unusedFiles.length > 0) {
    console.log(`Найдено ${unusedFiles.length} неиспользуемых файлов в ${path.basename(dir)}:`);
    unusedFiles.forEach(file => {
      const relativePath = file.replace(publicDir, '').replace(/\\/g, '/');
      try {
        fs.unlinkSync(file);
        console.log(`  ✓ Удален: ${relativePath}`);
      } catch (error) {
        console.log(`  ✗ Ошибка: ${relativePath}`);
      }
    });
  }
  
  // Проверяем, пуста ли папка после удаления
  const remainingFiles = fs.readdirSync(dir);
  if (remainingFiles.length === 0) {
    fs.rmdirSync(dir);
    const relativePath = dir.replace(publicDir, '').replace(/\\/g, '/');
    console.log(`  ✓ Удалена пустая папка: ${relativePath}\n`);
  } else {
    console.log(`  Осталось файлов в ${path.basename(dir)}: ${remainingFiles.length}\n`);
  }
});

// Удаляем пустую папку uploads/products
const uploadsProductsDir = path.join(publicDir, 'uploads', 'products');
if (fs.existsSync(uploadsProductsDir)) {
  const files = fs.readdirSync(uploadsProductsDir);
  if (files.length === 0) {
    fs.rmdirSync(uploadsProductsDir);
    console.log('✓ Удалена пустая папка: /uploads/products');
  }
}

// Проверяем дубликаты в uploads/categories (они уже есть в images/categories)
const uploadsCategoriesDir = path.join(publicDir, 'uploads', 'categories');
const imagesCategoriesDir = path.join(publicDir, 'images', 'categories');

if (fs.existsSync(uploadsCategoriesDir) && fs.existsSync(imagesCategoriesDir)) {
  const uploadsFiles = fs.readdirSync(uploadsCategoriesDir);
  const imagesFiles = fs.readdirSync(imagesCategoriesDir);
  
  uploadsFiles.forEach(file => {
    if (imagesFiles.includes(file)) {
      const filePath = path.join(uploadsCategoriesDir, file);
      const relativePath = filePath.replace(publicDir, '').replace(/\\/g, '/');
      
      // Проверяем, используется ли путь из uploads
      if (!isFileUsed(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`✓ Удален дубликат: ${relativePath}`);
        } catch (error) {
          console.log(`✗ Ошибка при удалении: ${relativePath}`);
        }
      }
    }
  });
  
  // Если uploads/categories пуста, удаляем
  const remainingUploads = fs.readdirSync(uploadsCategoriesDir);
  if (remainingUploads.length === 0) {
    fs.rmdirSync(uploadsCategoriesDir);
    console.log('✓ Удалена пустая папка: /uploads/categories');
    
    // Проверяем, пуста ли папка uploads
    const uploadsDir = path.join(publicDir, 'uploads');
    const uploadsContents = fs.readdirSync(uploadsDir);
    if (uploadsContents.length === 0) {
      fs.rmdirSync(uploadsDir);
      console.log('✓ Удалена пустая папка: /uploads');
    }
  }
}

console.log('\n✓ Готово!');

