import { NextResponse } from 'next/server';
import { addProduct, getAllProducts } from '@/lib/products-supabase';
import { requireAdmin } from '@/lib/auth-helpers';

// GET - получить все товары (для админки)
export async function GET() {
  try {
    // Проверяем, что пользователь является администратором
    await requireAdmin();
    
    const products = await getAllProducts();
    return NextResponse.json({ products });
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

// POST - создать новый товар
export async function POST(request) {
  try {
    // Проверяем, что пользователь является администратором
    await requireAdmin();
    
    const body = await request.json();
    
    // Валидация обязательных полей
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

