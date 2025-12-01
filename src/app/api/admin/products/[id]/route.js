import { NextResponse } from 'next/server';
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/lib/products-supabase';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    
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
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    
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

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await updateProduct(id, body);

    if (result.success) {
      return NextResponse.json({
        message: 'Product updated successfully',
        product: result.product,
      });
    }

    return NextResponse.json(
      { error: result.error || 'Failed to update product' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteProduct(id);

    if (result.success) {
      return NextResponse.json({
        message: 'Product deleted successfully',
      });
    }

    return NextResponse.json(
      { error: result.error || 'Failed to delete product' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

