import { NextResponse } from 'next/server';
import {
  getSessionUser,
  toPublicUser,
  toPublicProfile,
} from '@/shared/lib/auth-helpers';

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { user: null, profile: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: toPublicUser(user),
      profile: toPublicProfile(user),
    });
  } catch (error) {
    console.error('GET /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
