// /app/api/opd/incomplete-users/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Ambil semua user yang role-nya OPD dan belum memiliki opdId (belum punya profil instansi)
    const incompleteUsers = await prisma.user.findMany({
      where: {
        role: 'OPD',
        opdId: null, // Belum memiliki OPD
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ incompleteUsers });
  } catch (error) {
    'Gagal mengambil data OPD yang belum onboarding:', error;
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
