import { NextResponse } from 'next/server';
import { getCategories, addCategory } from '@/lib/categories';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  try {
    await requireAdmin();
    
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
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
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    const result = await addCategory(body);
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Category created successfully', category: result.category },
        { status: 201 }
      );
    }
    
    console.error('Failed to create category:', result.error);
    return NextResponse.json(
      { error: result.error || 'Failed to create category' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error creating category:', {
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

