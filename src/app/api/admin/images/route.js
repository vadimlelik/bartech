import { NextResponse } from 'next/server';
import { getImagesFromStorage } from '@/lib/storage';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || null;
    
    const images = await getImagesFromStorage(folder);
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    
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
