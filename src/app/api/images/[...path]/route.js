import { NextResponse } from 'next/server';

/**
 * API Route для проксирования изображений из Supabase Storage с кешированием
 * Это уменьшает исходящий трафик, так как изображения кешируются на сервере Next.js
 * 
 * Использование: /api/images/[supabase-image-url]
 * Пример: /api/images/https://xxxxx.supabase.co/storage/v1/object/public/images/products/image.jpg
 */
export async function GET(request, { params }) {
  try {
    const { path } = params;
    
    // Восстанавливаем полный URL из пути
    // path может быть массивом частей URL или закодированной строкой
    let imageUrl;
    if (Array.isArray(path)) {
      // Если это массив, объединяем части и декодируем
      imageUrl = decodeURIComponent(path.join('/'));
    } else {
      // Если это строка, декодируем её
      imageUrl = decodeURIComponent(path);
    }
    
    // Проверяем, что URL начинается с http:// или https://
    if (!imageUrl || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
      return NextResponse.json(
        { error: 'Invalid image URL' },
        { status: 400 }
      );
    }

    // Проверяем, что URL ведет на Supabase Storage
    if (!imageUrl.includes('.supabase.co') && !imageUrl.includes('storage')) {
      return NextResponse.json(
        { error: 'Only Supabase Storage URLs are allowed' },
        { status: 403 }
      );
    }

    // Загружаем изображение с Supabase
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      // Таймаут для предотвращения зависания
      signal: AbortSignal.timeout(10000), // 10 секунд
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status }
      );
    }

    // Получаем тип контента и данные изображения
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    // Возвращаем изображение с заголовками кеширования
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Кешируем на 30 дней на стороне клиента
        'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
        // Кешируем на 7 дней на стороне сервера (CDN/proxy)
        'CDN-Cache-Control': 'public, max-age=604800',
        // ETag для валидации кеша
        'ETag': `"${Buffer.from(imageBuffer).toString('base64').substring(0, 20)}"`,
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    
    // Если ошибка таймаута или сети, возвращаем 504
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Image fetch timeout' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Настройка кеширования для этого route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Отключаем статическую генерацию для динамических изображений

