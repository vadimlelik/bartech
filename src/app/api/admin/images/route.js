import { NextResponse } from 'next/server';
import { getMinioClient, getMinioBucket } from '@/lib/minio';

// Получение всех файлов из bucket MinIO с префиксом (эмуляция папок)
async function getAllFilesFromPrefix(prefix = '') {
  const client = getMinioClient();
  const bucket = getMinioBucket();

  if (!client) {
    return [];
  }

  const objectsStream = client.listObjectsV2(bucket, prefix || '', true);
  const files = [];

  const readerPromise = new Promise((resolve, reject) => {
    objectsStream.on('data', (obj) => {
      if (!obj.name) return;

      const name = obj.name.split('/').pop();
      const hasExtension =
        name.includes('.') &&
        name.split('.').length > 1 &&
        name.split('.').pop().length <= 5;

      if (hasExtension) {
        files.push({
          name,
          path: obj.name,
          size: obj.size || 0,
          lastModified: obj.lastModified,
        });
      }
    });
    objectsStream.on('end', resolve);
    objectsStream.on('error', reject);
  });

  await readerPromise;
  return files;
}

export async function GET(request) {
  try {
    const client = getMinioClient();
    if (!client) {
      return NextResponse.json(
        { error: 'MinIO is not configured' },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';

    let allFiles = [];

    if (folder) {
      allFiles = await getAllFilesFromPrefix(folder);
    } else {
      const prefixes = ['', 'products', 'categories'];
      for (const prefix of prefixes) {
        const files = await getAllFilesFromPrefix(prefix);
        allFiles = [...allFiles, ...files];
      }
    }

    const images = allFiles
      .filter((file) => {
        const ext = file.name.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      })
      .map((file) => {
        const url = `/api/images/${encodeURIComponent(file.path)}`;
        return {
          name: file.name,
          path: file.path,
          url,
          size: file.size || 0,
          created_at: file.lastModified,
          updated_at: file.lastModified,
        };
      });

    // Сортируем по дате создания (новые первыми)
    images.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

    return NextResponse.json({
      images,
      total: images.length,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/images:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}

