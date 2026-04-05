import { NextResponse } from 'next/server';
import { getSessionUser, toPublicUser, toPublicProfile } from '@/shared/lib/auth-helpers';

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { user: null, profile: null, isAdmin: false },
        { status: 401 }
      );
    }

    const profile = toPublicProfile(user);

    return NextResponse.json({
      user: toPublicUser(user),
      profile,
      isAdmin: profile.role === 'admin',
    });
  } catch (error) {
    console.error('GET /api/auth/check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
