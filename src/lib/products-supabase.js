import { supabaseAdmin } from './supabase';

// Проверка доступности Supabase
function checkSupabase() {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
}

export async function getAllProducts() {
  try {
    checkSupabase();
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    checkSupabase();
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
}

export async function addProduct(productData) {
  try {
    checkSupabase();
    
    // Обработка данных перед отправкой в Supabase
    const processedData = {
      name: productData.name || null,
      category: productData.category || null,
      category_id: productData.category_id || productData.categoryId || null,
      price: productData.price || 0,
      image: productData.image || null,
      images: Array.isArray(productData.images) ? productData.images : (productData.images ? [productData.images] : []),
      description: productData.description || null,
      specifications: productData.specifications || {},
    };

    // Удаляем пустые строки и преобразуем в null
    Object.keys(processedData).forEach(key => {
      if (processedData[key] === '') {
        processedData[key] = null;
      }
    });

    console.log('Attempting to insert product:', { 
      name: processedData.name,
      price: processedData.price,
      hasCategoryId: !!processedData.category_id 
    });

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([processedData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding product:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      
      // Более понятное сообщение для DNS ошибок
      let userFriendlyError = error.message || 'Failed to create product';
      if (error.message && error.message.includes('ENOTFOUND')) {
        userFriendlyError = 'Не удалось подключиться к Supabase. Проверьте правильность URL в файле .env.local. URL должен быть в формате: https://xxxxx.supabase.co';
        console.error('\n❌ ОШИБКА ПОДКЛЮЧЕНИЯ К SUPABASE');
        console.error('Проверьте файл .env.local и убедитесь, что:');
        console.error('1. NEXT_PUBLIC_SUPABASE_URL начинается с https://');
        console.error('2. Домен заканчивается на .supabase.co (не .com!)');
        console.error('3. URL скопирован из Supabase Dashboard: Settings → API → Project URL\n');
      }
      
      return { success: false, error: userFriendlyError };
    }

    return { success: true, product: data };
  } catch (error) {
    console.error('Exception in addProduct:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return { success: false, error: error.message || 'Unexpected error occurred' };
  }
}

export async function updateProduct(id, productData) {
  try {
    checkSupabase();
    
    // Обработка данных перед отправкой в Supabase
    const processedData = {
      name: productData.name || null,
      category: productData.category || null,
      category_id: productData.category_id || productData.categoryId || null,
      price: productData.price || 0,
      image: productData.image || null,
      images: Array.isArray(productData.images) ? productData.images : (productData.images ? [productData.images] : []),
      description: productData.description || null,
      specifications: productData.specifications || {},
    };

    // Удаляем пустые строки и преобразуем в null
    Object.keys(processedData).forEach(key => {
      if (processedData[key] === '') {
        processedData[key] = null;
      }
    });

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(processedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, product: data };
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id) {
  try {
    checkSupabase();
    
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return { success: false, error: error.message };
  }
}

