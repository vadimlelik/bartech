/** @type {import('next').NextConfig} */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isPhoneSubdomain = process.env.NEXT_PUBLIC_PHONE === 'true';

// Автоматически генерируем rewrite-правила на основе папок в src/app/(landing)
function generateSubdomainRewrites() {
  const landingDir = path.join(__dirname, 'src', 'app', '(landing)', '*');
  const rewrites = [];

  // Исключаем папки, которые не должны быть поддоменами
  const excludeDirs = ['thank-you'];

  try {
    const entries = fs.readdirSync(landingDir, { withFileTypes: true });

    entries.forEach((entry) => {
      // Пропускаем файлы и исключенные папки
      if (!entry.isDirectory() || excludeDirs.includes(entry.name)) {
        return;
      }

      const subdomain = entry.name;

      // Добавляем rewrite-правило для поддомена
      rewrites.push({
        source: `/${subdomain}/:path*`,
        destination: '/:path*',
      });
    });
  } catch (error) {
    console.warn(
      'Не удалось прочитать папку (landing), используем пустой список:',
      error.message
    );
  }

  return rewrites;
}

const nextConfig = {
  output: 'standalone', // Для Docker оптимизации
  assetPrefix: isPhoneSubdomain ? 'https://technobar.by' : '',
  reactStrictMode: false,
  eslint: {
    // Игнорировать ESLint ошибки при сборке (для production)
    // TODO: Исправить все ESLint ошибки и вернуть false
    ignoreDuringBuilds: true,
  },
  images: {
    // Разрешаем изображения из Supabase Storage и других внешних источников
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Включаем оптимизацию изображений (по умолчанию включена)
    // Это позволяет Next.js кешировать оптимизированные версии изображений
    formats: ['image/avif', 'image/webp'],
    // Минимальное время кеширования оптимизированных изображений (в секундах)
    // Next.js будет кешировать оптимизированные изображения на 60 дней
    minimumCacheTTL: 5184000, // 60 дней
    // Размеры изображений для генерации srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    // Автоматически генерируем rewrite-правила для всех поддоменов
    const subdomainRewrites = generateSubdomainRewrites();

    // Специальное правило для phone (перенаправление на корень)
    const phoneRewrite = {
      source: '/phone',
      destination: '/',
    };

    return [...subdomainRewrites, phoneRewrite];
  },
};

export default nextConfig;
