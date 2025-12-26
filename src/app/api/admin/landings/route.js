import { NextResponse } from 'next/server';
import { createLanding, getAllLandings } from '@/lib/landings-supabase';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  try {
    await requireAdmin();
    
    const landings = await getAllLandings();
    return NextResponse.json({ landings });
  } catch (error) {
    console.error('Error fetching landings:', error);
    
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
    
    const result = await createLanding(body);
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Landing created successfully', landing: result.landing },
        { status: 201 }
      );
    }
    
    console.error('Failed to create landing:', result.error);
    return NextResponse.json(
      { error: result.error || 'Failed to create landing' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error creating landing:', {
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

