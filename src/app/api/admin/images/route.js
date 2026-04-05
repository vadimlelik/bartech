import { NextResponse } from 'next/server';
import { getMinioClient, getMinioBucket } from '@/shared/lib/minio';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { listImagesUnderPublic } from '@/shared/lib/public-static-images';

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

function minioFilesToImages(allFiles) {
  return allFiles
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
        source: 'minio',
      };
    });
}

export async function GET(request) {
  try {
    await requireAdmin();
  } catch (e) {
    const status =
      e.message === 'Unauthorized' ? 401 : e.message?.includes('Forbidden') ? 403 : 403;
    return NextResponse.json({ error: e.message }, { status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';

    let minioImages = [];
    const client = getMinioClient();

    if (client) {
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
      minioImages = minioFilesToImages(allFiles);
    }

    const publicImages = listImagesUnderPublic();

    const byUrl = new Map();
    for (const img of [...minioImages, ...publicImages]) {
      if (!byUrl.has(img.url)) {
        byUrl.set(img.url, img);
      }
    }

    const images = Array.from(byUrl.values());
    images.sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0);
      const dateB = new Date(b.updated_at || b.created_at || 0);
      return dateB - dateA;
    });

    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
    const limit = Math.min(
      200,
      Math.max(1, parseInt(searchParams.get('limit') || '48', 10)),
    );
    const slice = images.slice(offset, offset + limit);

    return NextResponse.json({
      images: slice,
      total: images.length,
      offset,
      limit,
      hasMore: offset + limit < images.length,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/images:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
