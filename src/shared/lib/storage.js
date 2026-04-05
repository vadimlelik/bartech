import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { getMinioClient, getMinioBucket } from './minio';

function generateFileName(originalName) {
  const fileExt = originalName.split('.').pop();
  const uuid = randomUUID();
  return `${uuid}.${fileExt}`;
}

export async function uploadToMinioStorage(file, folder = 'products') {
  const client = getMinioClient();
  const bucket = getMinioBucket();

  if (!client) {
    throw new Error('MinIO is not configured');
  }

  const fileName = generateFileName(file.name);
  const objectKey = folder ? `${folder}/${fileName}` : fileName;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Пытаемся убедиться, что bucket существует
  try {
    const exists = await client.bucketExists(bucket);
    if (!exists) {
      await client.makeBucket(bucket, '');
    }
  } catch (err) {
    console.warn('[MinIO] bucket check/create failed:', err);
  }

  await client.putObject(bucket, objectKey, buffer, {
    'Content-Type': file.type || 'application/octet-stream',
  });

  // Храним путь через наш API-прокси, чтобы MinIO не был публичным
  const apiPath = `/api/images/${encodeURIComponent(objectKey)}`;

  return {
    success: true,
    path: apiPath,
    fileName,
    filePath: objectKey,
  };
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
  const storageMethod = process.env.IMAGE_STORAGE_METHOD || 'minio';

  try {
    if (storageMethod === 'minio') {
      try {
        return await uploadToMinioStorage(file, folder);
      } catch (error) {
        console.warn('MinIO Storage failed, falling back to local storage:', error.message);
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

