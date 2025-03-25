import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Ambil cookie dari header
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verifikasi token JWT
    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id;
    const role = decoded?.role;

    if (!userId || role !== 'OPD') {
      return NextResponse.json(
        { error: 'Unauthorized or invalid role' },
        { status: 403 }
      );
    }

    // Cek apakah user ini sudah punya profil OPD (berdasarkan staffUserId)
    const opdProfile = await prisma.oPD.findUnique({
      where: { staffUserId: userId },
    });

    return NextResponse.json({
      hasProfile: !!opdProfile,
      profile: opdProfile ?? null,
    });
  } catch (error) {
    console.error('Cek OPD profile error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
