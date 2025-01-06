import fs from 'fs';
import path from 'path';

const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');

export function getCategories() {
  try {
    const data = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    return data;
  } catch (error) {
    'Error reading categories:', error;
    return [];
  }
}

export async function getCategoryById(id) {
  if (!id) return null;

  try {
    const categories = getCategories();
    if (!Array.isArray(categories)) {
      return null;
    }

    // Если передано название категории, пытаемся найти по имени
    const categoryByName = categories.find(
      (category) => category.name.toLowerCase() === id.toString().toLowerCase()
    );
    if (categoryByName) {
      return categoryByName;
    }

    // Если по имени не нашли, ищем по ID
    const categoryById = categories.find(
      (category) => category.id.toLowerCase() === id.toString().toLowerCase()
    );
    return categoryById || null;
  } catch (error) {
    'Error in getCategoryById:', error;
    return null;
  }
}
