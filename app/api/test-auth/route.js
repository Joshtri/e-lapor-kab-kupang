import { getAuthenticatedUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Debug endpoint untuk test authentication
 * Cek bahwa ID di-normalize dengan benar ke string
 */
export async function GET(req) {
  try {
    const decoded = await getAuthenticatedUser(req);

    if (!decoded) {
      return NextResponse.json({
        authenticated: false,
        message: 'No valid token found',
      });
    }

    return NextResponse.json({
      authenticated: true,
      decoded: {
        id: decoded.id,
        id_type: typeof decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
      message: 'Token decoded successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
