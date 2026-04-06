import { NextResponse } from 'next/server';
import { uploadImage } from '@/shared/lib/storage';
import { requireAdmin } from '@/shared/lib/auth-helpers';

export async function POST(request) {
  try {
    await requireAdmin();

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
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message?.startsWith('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.error('Error uploading file:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

