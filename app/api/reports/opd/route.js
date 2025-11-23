import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const authCookies = cookies();
  const token = authCookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    // Get user with their OPD
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { opd: true },
    });

    if (!user?.opd) {
      return NextResponse.json(
        { error: 'OPD tidak ditemukan' },
        { status: 404 },
      );
    }

    // Ambil semua report yang ditujukan ke OPD tersebut
    const reports = await prisma.report.findMany({
      where: {
        opdId: user.opd.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        opd: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    'Gagal fetch laporan by OPD login:', error;
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
