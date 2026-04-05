import { Client } from 'minio';

let minioClient = null;

export function getMinioClient() {
  if (minioClient) return minioClient;

  const {
    MINIO_ENDPOINT,
    MINIO_PORT,
    MINIO_USE_SSL,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
  } = process.env;

  if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY) {
    console.warn(
      '[MinIO] MINIO_ENDPOINT / MINIO_ACCESS_KEY / MINIO_SECRET_KEY are not configured. Falling back to local storage.',
    );
    return null;
  }

  minioClient = new Client({
    endPoint: MINIO_ENDPOINT,
    port: MINIO_PORT ? Number(MINIO_PORT) : 9000,
    useSSL: MINIO_USE_SSL === 'true',
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
  });

  return minioClient;
}

export function getMinioBucket() {
  return process.env.MINIO_BUCKET || 'images';
}


