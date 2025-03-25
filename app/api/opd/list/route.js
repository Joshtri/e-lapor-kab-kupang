import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const opdList = await prisma.oPD.findMany({
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reports: true, // opsional: tampilkan semua laporan untuk instansi ini
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(opdList);
  } catch (error) {
    console.error('Gagal ambil data OPD:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}