import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Функция для получения всех файлов из папки (включая подпапки)
async function getAllFilesFromFolder(folder = '') {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .list(folder, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error(`Error listing folder ${folder}:`, error);
      return [];
    }

    if (!data) return [];

    const files = [];
    
    for (const item of data) {
      // Проверяем, является ли элемент файлом (имеет расширение)
      const hasExtension = item.name.includes('.') && 
        item.name.split('.').length > 1 &&
        item.name.split('.').pop().length <= 5; // Расширение обычно короткое
      
      if (hasExtension) {
        // Это файл
        const filePath = folder ? `${folder}/${item.name}` : item.name;
        files.push({
          name: item.name,
          path: filePath,
          metadata: item.metadata,
          created_at: item.created_at,
          updated_at: item.updated_at,
        });
      } else {
        // Возможно, это папка - получаем файлы из неё
        const subFolder = folder ? `${folder}/${item.name}` : item.name;
        const subFiles = await getAllFilesFromFolder(subFolder);
        files.push(...subFiles);
      }
    }

    return files;
  } catch (error) {
    console.error(`Error in getAllFilesFromFolder for ${folder}:`, error);
    return [];
  }
}

export async function GET(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';

    let allFiles = [];

    if (folder) {
      // Получаем файлы из указанной папки
      allFiles = await getAllFilesFromFolder(folder);
    } else {
      // Получаем файлы из корня и основных папок
      const folders = ['', 'products', 'categories'];
      
      for (const folderPath of folders) {
        const files = await getAllFilesFromFolder(folderPath);
        allFiles = [...allFiles, ...files];
      }
    }

    // Преобразуем данные в массив с публичными URL и фильтруем только изображения
    const imagesWithUrls = await Promise.all(
      allFiles
        .filter((file) => {
          const ext = file.name.toLowerCase().split('.').pop();
          return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
        })
        .map(async (file) => {
          const { data: urlData } = supabaseAdmin.storage
            .from('images')
            .getPublicUrl(file.path);

          return {
            name: file.name,
            path: file.path,
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            created_at: file.created_at,
            updated_at: file.updated_at,
          };
        })
    );

    // Удаляем дубликаты по URL (один и тот же файл может быть в разных папках)
    const uniqueImagesMap = new Map();
    imagesWithUrls.forEach((img) => {
      // Используем URL как ключ для удаления дубликатов
      if (!uniqueImagesMap.has(img.url)) {
        uniqueImagesMap.set(img.url, img);
      }
    });

    const images = Array.from(uniqueImagesMap.values());

    // Сортируем по дате создания (новые первыми)
    images.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

    return NextResponse.json({
      images: images,
      total: images.length,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/images:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

