import { NextResponse } from 'next/server';
import { addProduct, listProductsForAdmin } from '@/entities/product/model/products-db';
import { requireAdmin } from '@/shared/lib/auth-helpers';

export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '40', 10);
    const search = searchParams.get('search') || '';

    const result = await listProductsForAdmin({
      page: Number.isNaN(page) ? 1 : page,
      limit: Number.isNaN(limit) ? 40 : limit,
      search,
    });

    return NextResponse.json({
      products: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }
    
    const result = await addProduct(body);
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Product created successfully', product: result.product },
        { status: 201 }
      );
    }
    
    console.error('Failed to create product:', result.error);
    return NextResponse.json(
      { error: result.error || 'Failed to create product' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error creating product:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    });
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

