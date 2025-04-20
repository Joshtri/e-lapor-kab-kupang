import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const availableUsers = await prisma.user.findMany({
      where: {
        role: 'OPD',
        opd: null, // user belum punya entri di tabel OPD
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(availableUsers);
  } catch (error) {
    '❌ Gagal ambil user OPD yang tersedia:', error;
    return NextResponse.json(
      { error: 'Gagal memuat data user OPD' },
      { status: 500 },
    );
  }
}
