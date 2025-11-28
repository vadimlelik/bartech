import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/storage';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Проверяем размер файла (максимум 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Получаем папку из запроса (по умолчанию 'products')
    const folder = formData.get('folder') || 'products';
    
    // Загружаем изображение (Supabase Storage или локальное хранилище)
    const uploadResult = await uploadImage(file, folder);

    return NextResponse.json({
      message: 'File uploaded successfully',
      path: uploadResult.path,
      fileName: uploadResult.fileName,
    });
  } catch (error) {
    console.error('Error uploading file:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Более понятные сообщения об ошибках
    let errorMessage = 'Failed to upload file';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.error) {
      errorMessage = error.error;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

