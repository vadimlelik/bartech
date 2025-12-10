import { getCategories } from '../../../lib/categories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await getCategories();
    const response = NextResponse.json(categories);
    
    // Отключаем кеширование для API ответов, чтобы новые данные отображались сразу после деплоя
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (e) {
    console.error('Error fetching categories:', e);
    const response = NextResponse.json(
      { error: 'Unable to fetch categories' },
      { status: 500 }
    );
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  }
}
