import { NextResponse } from 'next/server';
import { getLandingPageById, updateLandingPage, deleteLandingPage } from '@/lib/landing-supabase';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }
    
    const landingPage = await getLandingPageById(id);
    
    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ landingPage });
  } catch (error) {
    console.error('Error fetching landing page:', error);
    
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
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    if (!body.slug || !body.title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      );
    }
    
    const result = await updateLandingPage(id, body);
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Landing page updated successfully', landingPage: result.landingPage },
        { status: 200 }
      );
    }
    
    console.error('Failed to update landing page:', result.error);
    return NextResponse.json(
      { error: result.error || 'Failed to update landing page' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error updating landing page:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }
    
    const result = await deleteLandingPage(id);
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Landing page deleted successfully' },
        { status: 200 }
      );
    }
    
    console.error('Failed to delete landing page:', result.error);
    return NextResponse.json(
      { error: result.error || 'Failed to delete landing page' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error deleting landing page:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
