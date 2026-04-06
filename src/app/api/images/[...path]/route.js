import { NextResponse } from 'next/server';
import { getMinioClient, getMinioBucket } from '@/shared/lib/minio';

/**
 * API Route для выдачи изображений из MinIO (или совместимого S3-хранилища) с кешированием
 *
 * Использование: /api/images/[objectKey]
 * Пример: /api/images/products%2Fimage.jpg  (objectKey = "products/image.jpg")
 */
export async function GET(request, { params }) {
  try {
    const { path } = params;

    // Восстанавливаем objectKey из пути
    let objectKey;
    if (Array.isArray(path)) {
      objectKey = decodeURIComponent(path.join('/'));
    } else {
      objectKey = decodeURIComponent(path);
    }

    if (!objectKey) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
    }

    if (objectKey.includes('..') || objectKey.startsWith('/') || objectKey.includes('\0')) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
    }

    const client = getMinioClient();
    const bucket = getMinioBucket();

    if (!client) {
      return NextResponse.json(
        { error: 'MinIO is not configured on the server' },
        { status: 500 },
      );
    }

    let stream;
    try {
      stream = await client.getObject(bucket, objectKey);
    } catch (err) {
      console.error('Error fetching object from MinIO:', err);
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const chunks = [];
    const readerPromise = new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    await readerPromise;
    const buffer = Buffer.concat(chunks);

    // Определяем content-type по расширению файла
    const ext = objectKey.split('.').pop()?.toLowerCase();
    const contentTypeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control':
          'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error serving image from MinIO:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Настройка кеширования для этого route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Отключаем статическую генерацию для динамических изображений
