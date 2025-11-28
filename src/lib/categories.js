import { 
  getAllCategories as getAllCategoriesSupabase,
  getCategoryById as getCategoryByIdSupabase,
  addCategory as addCategorySupabase,
  updateCategory as updateCategorySupabase,
  deleteCategory as deleteCategorySupabase
} from './categories-supabase';

// Экспортируем функции для работы с категориями из Supabase
export async function getCategories() {
  try {
    return await getAllCategoriesSupabase();
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

export async function getCategoryById(id) {
  if (!id) return null;

  try {
    // Сначала пытаемся найти по ID
    let category = await getCategoryByIdSupabase(id);
    
    if (category) {
      return category;
    }

    // Если по ID не нашли, пытаемся найти по имени
    const categories = await getAllCategoriesSupabase();
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
    return await addCategorySupabase(categoryData);
  } catch (error) {
    console.error('Error adding category:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id, categoryData) {
  try {
    return await updateCategorySupabase(id, categoryData);
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id) {
  try {
    return await deleteCategorySupabase(id);
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
}
