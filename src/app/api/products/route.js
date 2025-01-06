import { getProducts } from '@/lib/products';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      categoryId: searchParams.get('categoryId'),
      search: searchParams.get('search'),
      sort: searchParams.get('sort') || 'asc',
      sortBy: searchParams.get('sortBy') || 'name',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      ids: searchParams.get('ids')?.split(',') || [],
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

    return NextResponse.json({
      products: result.products || [],
      filters: result.filters || {},
      pagination: {
        total: result.pagination?.total || 0,
        page: result.pagination?.page || 1,
        limit: result.pagination?.limit || 12,
        pages: result.pagination?.pages || 1,
      },
    });
  } catch (error) {
    'Error in products API:', error;
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
