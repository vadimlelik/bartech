import { NextResponse } from 'next/server';
import { getSessionUser, toPublicProfile } from '@/shared/lib/auth-helpers';

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ profile: toPublicProfile(user) });
  } catch (error) {
    console.error('GET /api/auth/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
