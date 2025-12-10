import { supabaseAdmin } from './supabase';
import { getServerSupabaseClient } from './auth-helpers';

function checkSupabase() {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
}

// Получаем правильный клиент для операций с категориями
// Если service role key установлен, используем supabaseAdmin (обходит RLS)
// Если нет, используем аутентифицированный клиент с контекстом пользователя
async function getCategoryClient() {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Если service role key установлен, используем supabaseAdmin (обходит RLS)
  if (supabaseServiceRoleKey) {
    return supabaseAdmin;
  }
  
  // Иначе используем аутентифицированный клиент с контекстом пользователя
  // Это необходимо, чтобы RLS мог определить auth.uid()
  try {
    return await getServerSupabaseClient();
  } catch (error) {
    console.warn('Failed to get authenticated client, falling back to supabaseAdmin:', error);
    return supabaseAdmin;
  }
}

export async function getAllCategories() {
  try {
    checkSupabase();
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Фильтруем категории с валидным ID и названием
    const validCategories = (data || []).filter(
      (category) => category && category.id && category.id.trim() !== '' && category.name && category.name.trim() !== ''
    );

    return validCategories;
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    return [];
  }
}

export async function getCategoryById(id) {
  try {
    checkSupabase();
    
    if (!id) return null;

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // PGRST116 - это нормальная ошибка, когда категория не найдена
      // Не логируем её как ошибку, только другие ошибки
      if (error.code !== 'PGRST116') {
        console.error('Error fetching category:', error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    return null;
  }
}

export async function addCategory(categoryData) {
  try {
    checkSupabase();
    
    const categoryName = categoryData.name?.trim();
    if (!categoryName || categoryName === '') {
      return { success: false, error: 'Category name is required' };
    }
    
    let categoryId = categoryData.id?.trim();
    if (!categoryId || categoryId === '') {
      categoryId = categoryName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-') // Убираем множественные дефисы
        .replace(/^-|-$/g, '');
    }
    
    if (!categoryId || categoryId === '') {
      return { success: false, error: 'Failed to generate category ID from name. Please provide an ID manually.' };
    }
    
    const processedData = {
      id: categoryId,
      name: categoryName,
      image: categoryData.image || null,
      description: categoryData.description || null,
    };

    // Удаляем пустые строки и преобразуем в null
    Object.keys(processedData).forEach(key => {
      if (processedData[key] === '') {
        processedData[key] = null;
      }
    });

    console.log('Attempting to insert category:', { 
      id: processedData.id,
      name: processedData.name,
      hasImage: !!processedData.image 
    });

    const client = await getCategoryClient();
    const { data, error } = await client
      .from('categories')
      .insert([processedData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding category:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      
      let userFriendlyError = error.message || 'Failed to create category';
      if (error.code === '23505') { // Unique violation
        userFriendlyError = `Категория с ID "${categoryId}" уже существует`;
      } else if (error.message && error.message.includes('ENOTFOUND')) {
        userFriendlyError = 'Не удалось подключиться к Supabase. Проверьте правильность URL в файле .env.local. URL должен быть в формате: https://xxxxx.supabase.co';
      }
      
      return { success: false, error: userFriendlyError };
    }

    return { success: true, category: data };
  } catch (error) {
    console.error('Exception in addCategory:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return { success: false, error: error.message || 'Unexpected error occurred' };
  }
}

export async function updateCategory(id, categoryData) {
  try {
    checkSupabase();
    
    if (!id) {
      return { success: false, error: 'Category ID is required' };
    }
    
    const processedData = {
      name: categoryData.name || null,
      image: categoryData.image || null,
      description: categoryData.description || null,
    };

    Object.keys(processedData).forEach(key => {
      if (processedData[key] === '') {
        processedData[key] = null;
      }
    });

    const client = await getCategoryClient();
    const { data, error } = await client
      .from('categories')
      .update(processedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Category not found' };
    }

    return { success: true, category: data };
  } catch (error) {
    console.error('Error in updateCategory:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id) {
  try {
    checkSupabase();
    
    if (!id) {
      return { success: false, error: 'Category ID is required' };
    }
    
    const client = await getCategoryClient();
    const { error } = await client
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    return { success: false, error: error.message };
  }
}

