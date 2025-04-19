import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  try {
    // Bikin cookie expired
    const expiredCookie = serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0), // expired di masa lalu
      path: '/',
    });

    return new NextResponse(JSON.stringify({ message: 'Logout berhasil' }), {
      status: 200,
      headers: { 'Set-Cookie': expiredCookie },
    });
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout.' },
      { status: 500 },
    );
  }
}
