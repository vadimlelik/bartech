import { getProducts } from '@/lib/products';
import { NextResponse } from 'next/server';

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

    const result = await getProducts(params);

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

    // Отключаем кеширование для API ответов, чтобы новые данные отображались сразу после деплоя
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
