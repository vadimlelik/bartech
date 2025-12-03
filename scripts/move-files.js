import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем маппинг
const mapping = JSON.parse(fs.readFileSync('scripts/image-mapping.json', 'utf8'));

const publicDir = path.join(process.cwd(), 'public');

// Функция для создания директорий
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Перемещаем файлы
let moved = 0;
let notFound = 0;
const notFoundFiles = [];

for (const [oldPath, newPath] of Object.entries(mapping)) {
  // Пропускаем внешние URL
  if (oldPath.startsWith('http')) {
    continue;
  }

  const oldFilePath = path.join(publicDir, oldPath);
  const newFilePath = path.join(publicDir, newPath);
  
  // Создаем директорию для нового файла
  const newDir = path.dirname(newFilePath);
  ensureDir(newDir);

  // Проверяем существование старого файла
  if (fs.existsSync(oldFilePath)) {
    // Если новый файл уже существует, пропускаем
    if (fs.existsSync(newFilePath)) {
      console.log(`Файл уже существует: ${newPath}`);
      continue;
    }
    
    // Перемещаем файл
    try {
      fs.renameSync(oldFilePath, newFilePath);
      moved++;
      console.log(`Перемещен: ${oldPath} -> ${newPath}`);
    } catch (error) {
      console.error(`Ошибка при перемещении ${oldPath}:`, error.message);
    }
  } else {
    // Проверяем, может файл уже в новой структуре
    if (fs.existsSync(newFilePath)) {
      console.log(`Файл уже в новой структуре: ${newPath}`);
      continue;
    }
    
    notFound++;
    notFoundFiles.push(oldPath);
    console.warn(`Файл не найден: ${oldPath}`);
  }
}

console.log(`\nИтого перемещено: ${moved}`);
console.log(`Не найдено: ${notFound}`);
if (notFoundFiles.length > 0) {
  console.log('\nНе найденные файлы:');
  notFoundFiles.forEach(f => console.log(`  - ${f}`));
}

