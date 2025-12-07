import { supabaseAdmin } from './supabase';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

function generateFileName(originalName) {
  const fileExt = originalName.split('.').pop();
  const uuid = randomUUID();
  return `${uuid}.${fileExt}`;
}

export async function uploadToSupabaseStorage(file, folder = 'products') {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase is not configured');
    }

    const fileName = generateFileName(file.name);
    const filePath = `${folder}/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
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

export async function uploadToLocalStorage(file, folder = 'products') {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = generateFileName(file.name);
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

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

export async function uploadImage(file, folder = 'products') {
  const storageMethod = process.env.IMAGE_STORAGE_METHOD || 'supabase';

  try {
    if (storageMethod === 'supabase' && supabaseAdmin) {
      try {
        return await uploadToSupabaseStorage(file, folder);
      } catch (error) {
        console.warn('Supabase Storage failed, falling back to local storage:', error.message);
        return await uploadToLocalStorage(file, folder);
      }
    } else {
      return await uploadToLocalStorage(file, folder);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function getImagesFromStorage(folder = null) {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase is not configured');
    }

    const storageMethod = process.env.IMAGE_STORAGE_METHOD || 'supabase';

    if (storageMethod === 'supabase' && supabaseAdmin) {
      // Получаем все файлы из всех папок
      // Сначала получаем список всех папок
      const folders = ['products', 'categories', 'landing'];
      let allFiles = [];

      for (const folderName of folders) {
        try {
          const { data, error } = await supabaseAdmin.storage
            .from('images')
            .list(folderName, {
              limit: 1000,
              sortBy: { column: 'created_at', order: 'desc' },
            });

          if (error) {
            console.warn(`Error listing files in ${folderName}:`, error);
            continue;
          }

          if (data && data.length > 0) {
            const folderFiles = data
              .filter(item => {
                // Фильтруем только файлы (не папки)
                const ext = item.name.split('.').pop()?.toLowerCase();
                return ext && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
              })
              .map(item => ({
                ...item,
                fullPath: `${folderName}/${item.name}`,
                folder: folderName,
              }));

            allFiles = allFiles.concat(folderFiles);
          }
        } catch (err) {
          console.warn(`Error processing folder ${folderName}:`, err);
        }
      }

      // Фильтруем по папке, если указана
      if (folder) {
        allFiles = allFiles.filter(file => file.folder === folder);
      }

      // Получаем публичные URL для каждого файла
      const images = allFiles.map(file => {
        const { data: urlData } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(file.fullPath);

        return {
          path: urlData.publicUrl,
          name: file.name,
          folder: file.folder,
          fullPath: file.fullPath,
          createdAt: file.created_at,
          updatedAt: file.updated_at,
        };
      });

      return images;
    } else {
      // Для локального хранилища
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        return [];
      }

      const images = [];
      const folders = folder ? [folder] : fs.readdirSync(uploadDir);

      folders.forEach(folderName => {
        const folderPath = path.join(uploadDir, folderName);
        if (fs.statSync(folderPath).isDirectory()) {
          const files = fs.readdirSync(folderPath);
          files.forEach(fileName => {
            const ext = fileName.split('.').pop()?.toLowerCase();
            if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
              images.push({
                path: `/uploads/${folderName}/${fileName}`,
                name: fileName,
                folder: folderName,
                createdAt: null,
                updatedAt: null,
              });
            }
          });
        }
      });

      return images;
    }
  } catch (error) {
    console.error('Error getting images from storage:', error);
    return [];
  }
}
