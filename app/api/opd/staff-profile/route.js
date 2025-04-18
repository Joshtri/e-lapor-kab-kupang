import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth'; // pastikan path-nya sesuai
import prisma from '@/lib/prisma';

export async function GET(req) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role !== 'OPD') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const opd = await prisma.oPD.findFirst({
      where: { staffUserId: user.id },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!opd) {
      return NextResponse.json(
        { error: 'Profil OPD tidak ditemukan' },
        { status: 404 },
      );
    }

    return NextResponse.json(opd, { status: 200 });
  } catch (error) {
    console.error('Gagal mengambil data OPD:', error);
    return NextResponse.json(
      { error: 'Server error saat mengambil data OPD' },
      { status: 500 },
    );
  }
}
