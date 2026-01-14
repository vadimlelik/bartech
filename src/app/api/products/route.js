import { getProducts } from '@/lib/products';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '12', 10);

    const params = {
      categoryId: searchParams.get('categoryId'),
      search: searchParams.get('search'),
      sort: searchParams.get('sort') || 'asc',
      sortBy: searchParams.get('sortBy') || 'name',
      page: isNaN(pageParam) || pageParam < 1 ? 1 : pageParam,
      limit: isNaN(limitParam) || limitParam < 1 || limitParam > 100 ? 12 : limitParam,
      ids: searchParams.get('ids')?.split(',').filter(Boolean) || [],
      filters: {},
    };

    // Собираем все возможные фильтры
    const filterFields = [
      'memory',
      'ram',
      'processor',
      'display',
      'camera',
      'battery',
      'os',
      'color',
      'year',
    ];
    filterFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value) params.filters[field] = value;
    });

    // Кэшируем результаты запросов на 5 минут для снижения нагрузки на Supabase
    // Создаем уникальный ключ кэша на основе параметров запроса
    const cacheKey = `products-${JSON.stringify(params)}`;
    
    const getCachedProducts = unstable_cache(
      async (params) => {
        return await getProducts(params);
      },
      [cacheKey], // Уникальный ключ для каждого набора параметров
      {
        revalidate: 300, // 5 минут
        tags: ['products'],
      }
    );

    const result = await getCachedProducts(params);

    if (!result) {
      return NextResponse.json(
        { error: 'Products not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      products: result.products || [],
      filters: result.filters || {},
      pagination: {
        total: result.pagination?.total || 0,
        page: result.pagination?.page || 1,
        limit: result.pagination?.limit || 12,
        pages: result.pagination?.pages || 1,
      },
    });

    // Кэшируем ответ на клиенте на 1 минуту (данные уже кэшированы на сервере)
    // Это снижает количество запросов к Supabase при частых обращениях
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    return response;
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
