import { getProductById } from '@/lib/products';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);

    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await getProductById(id);
    if (!product) {
      const errorResponse = NextResponse.json({ error: 'Product not found' }, { status: 404 });
      errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return errorResponse;
    }

    const response = NextResponse.json({ product });
    
    // Отключаем кеширование для API ответов, чтобы новые данные отображались сразу после деплоя
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
