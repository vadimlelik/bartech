import { NextResponse } from 'next/server';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '@/lib/categories';
import { requireAdmin } from '@/lib/auth-helpers';

// GET - получить категорию по ID
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await getCategoryById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    
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

// PUT - обновить категорию
export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const result = await updateCategory(id, body);

    if (result.success) {
      return NextResponse.json({
        message: 'Category updated successfully',
        category: result.category,
      });
    }

    return NextResponse.json(
      { error: result.error || 'Failed to update category' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE - удалить категорию
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteCategory(id);

    if (result.success) {
      return NextResponse.json({
        message: 'Category deleted successfully',
      });
    }

    return NextResponse.json(
      { error: result.error || 'Failed to delete category' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

