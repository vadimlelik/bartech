import { NextResponse } from 'next/server';
import { getAllLandingPages, addLandingPage } from '@/lib/landing-supabase';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  try {
    await requireAdmin();
    
    const landingPages = await getAllLandingPages();
    return NextResponse.json({ landingPages });
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    
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
    
    if (!body.slug || !body.title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      );
    }
    
    const result = await addLandingPage(body);
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Landing page created successfully', landingPage: result.landingPage },
        { status: 201 }
      );
    }
    
    console.error('Failed to create landing page:', result.error);
    return NextResponse.json(
      { error: result.error || 'Failed to create landing page' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error creating landing page:', {
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
