import { NextResponse } from 'next/server';
import { getLandingPageBySlug } from '@/lib/landing-supabase';

export async function GET(request, { params }) {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }
    
    const landingPage = await getLandingPageBySlug(slug);
    
    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ landingPage });
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
