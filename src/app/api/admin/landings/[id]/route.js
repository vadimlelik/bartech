import { NextResponse } from 'next/server';
import {
  getLandingById,
  updateLanding,
  deleteLanding,
} from '@/entities/landing/model/landings-db';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { revalidateTag } from 'next/cache';

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: 'Landing ID is required' },
        { status: 400 }
      );
    }

    const landing = await getLandingById(id);
    if (!landing) {
      return NextResponse.json({ error: 'Landing not found' }, { status: 404 });
    }

    return NextResponse.json({ landing });
  } catch (error) {
    console.error('Error fetching landing:', error);
    
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
        { error: 'Landing ID is required' },
        { status: 400 }
      );
    }

    const result = await updateLanding(id, body);

    if (result.success) {
      // Инвалидируем кэш лендингов после обновления
      revalidateTag('landings');
      return NextResponse.json({
        message: 'Landing updated successfully',
        landing: result.landing,
      });
    }

    return NextResponse.json(
      { error: result.error || 'Failed to update landing' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error updating landing:', error);
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
        { error: 'Landing ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteLanding(id);

    if (result.success) {
      // Инвалидируем кэш лендингов после удаления
      revalidateTag('landings');
      return NextResponse.json({
        message: 'Landing deleted successfully',
      });
    }

    return NextResponse.json(
      { error: result.error || 'Failed to delete landing' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error deleting landing:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

