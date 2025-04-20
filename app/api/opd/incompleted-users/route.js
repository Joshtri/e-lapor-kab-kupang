// /app/api/opd/incomplete-users/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Ambil semua user yang role-nya OPD
    const opdUsers = await prisma.user.findMany({
      where: { role: 'OPD' },
      select: { id: true, name: true, email: true },
    });

    // Ambil semua staffUserId dari tabel OPD (sudah jadi staff)
    const opdStaffs = await prisma.oPD.findMany({
      select: { staffUserId: true },
    });

    const userIdsWithProfile = opdStaffs.map((opd) => opd.staffUserId);

    // Filter user OPD yang belum jadi staff (belum punya profil instansi)
    const incompleteUsers = opdUsers.filter(
      (user) => !userIdsWithProfile.includes(user.id),
    );

    return NextResponse.json({ incompleteUsers });
  } catch (error) {
    'Gagal mengambil data OPD yang belum onboarding:', error;
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
