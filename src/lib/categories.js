import fs from 'fs';
import path from 'path';
import {
  getAllCategories as getAllCategoriesDb,
  getCategoryById as getCategoryByIdDb,
  addCategory as addCategoryDb,
  updateCategory as updateCategoryDb,
  deleteCategory as deleteCategoryDb,
} from './categories-db';

const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');

function getAllCategoriesFromJSON() {
  try {
    if (!fs.existsSync(categoriesPath)) return [];
    const raw = fs.readFileSync(categoriesPath, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading categories JSON:', error);
    return [];
  }
}

const useDb = Boolean(process.env.DATABASE_URL);

export async function getCategories() {
  try {
    if (useDb) {
      return await getAllCategoriesDb();
    }
    return getAllCategoriesFromJSON();
  } catch (error) {
    console.error('Error reading categories:', error);
    return getAllCategoriesFromJSON();
  }
}

export async function getCategoryById(id) {
  if (!id) return null;

  try {
    let category = null;
    if (useDb) {
      category = await getCategoryByIdDb(id);
    } else {
      const categories = getAllCategoriesFromJSON();
      category = categories.find((cat) => String(cat.id) === String(id)) || null;
    }

    if (category) {
      return category;
    }

    const categories = useDb ? await getAllCategoriesDb() : getAllCategoriesFromJSON();
    const categoryByName = categories.find(
      (cat) => cat.name.toLowerCase() === id.toString().toLowerCase()
    );
    
    return categoryByName || null;
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    return null;
  }
}

export async function addCategory(categoryData) {
  try {
    if (useDb) return await addCategoryDb(categoryData);
    return { success: false, error: 'Database is not configured' };
  } catch (error) {
    console.error('Error adding category:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id, categoryData) {
  try {
    if (useDb) return await updateCategoryDb(id, categoryData);
    return { success: false, error: 'Database is not configured' };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id) {
  try {
    if (useDb) return await deleteCategoryDb(id);
    return { success: false, error: 'Database is not configured' };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
}
