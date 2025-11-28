import { supabaseAdmin } from './supabase';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

/**
 * Генерация уникального имени файла
 */
function generateFileName(originalName) {
  const fileExt = originalName.split('.').pop();
  const uuid = randomUUID();
  return `${uuid}.${fileExt}`;
}

/**
 * Загрузка изображения в Supabase Storage
 */
export async function uploadToSupabaseStorage(file, folder = 'products') {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase is not configured');
    }

    // Генерируем уникальное имя файла
    const fileName = generateFileName(file.name);
    const filePath = `${folder}/${fileName}`;

    // Конвертируем файл в ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Загружаем в Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      // Более понятные сообщения об ошибках Supabase
      let errorMessage = error.message || 'Failed to upload to Supabase Storage';
      
      if (error.message?.includes('Bucket not found')) {
        errorMessage = 'Bucket "images" не найден. Создайте bucket в Supabase Dashboard → Storage';
      } else if (error.message?.includes('new row violates row-level security')) {
        errorMessage = 'Ошибка прав доступа. Проверьте политики Storage в Supabase Dashboard';
      } else if (error.message?.includes('duplicate')) {
        errorMessage = 'Файл с таким именем уже существует';
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }

    // Получаем публичный URL
    const { data: urlData } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath);

    return {
      success: true,
      path: urlData.publicUrl,
      fileName: fileName,
      filePath: filePath,
    };
  } catch (error) {
    console.error('Error uploading to Supabase Storage:', error);
    throw error;
  }
}

/**
 * Загрузка изображения в локальное хранилище (fallback)
 */
export async function uploadToLocalStorage(file, folder = 'products') {
  try {
    // Создаем папку если её нет
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Генерируем уникальное имя файла
    const fileName = generateFileName(file.name);
    const filePath = path.join(uploadDir, fileName);

    // Конвертируем файл в buffer и сохраняем
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Возвращаем публичный URL
    const publicUrl = `/uploads/${folder}/${fileName}`;

    return {
      success: true,
      path: publicUrl,
      fileName: fileName,
      filePath: filePath,
    };
  } catch (error) {
    console.error('Error uploading to local storage:', error);
    throw error;
  }
}

/**
 * Универсальная функция загрузки (пытается Supabase, затем локальное хранилище)
 */
export async function uploadImage(file, folder = 'products') {
  // Определяем метод хранения из переменных окружения
  const storageMethod = process.env.IMAGE_STORAGE_METHOD || 'supabase';

  try {
    if (storageMethod === 'supabase' && supabaseAdmin) {
      try {
        return await uploadToSupabaseStorage(file, folder);
      } catch (error) {
        console.warn('Supabase Storage failed, falling back to local storage:', error.message);
        // Fallback на локальное хранилище
        return await uploadToLocalStorage(file, folder);
      }
    } else {
      // Используем локальное хранилище
      return await uploadToLocalStorage(file, folder);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

