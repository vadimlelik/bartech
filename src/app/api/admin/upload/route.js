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

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const folder = formData.get('folder') || 'products';
    
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

