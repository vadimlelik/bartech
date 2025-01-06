import { getCategories } from '../../../lib/categories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(categories);
  } catch (e) {
    return NextResponse.json(
      { error: 'Unable to fetch categories' },
      { status: 500 }
    );
  }
}
