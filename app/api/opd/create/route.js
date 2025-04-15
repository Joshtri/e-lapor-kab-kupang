import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, alamat, email, telp, website, staffUserId } = body;

    // Cek apakah user ada dan role-nya OPD
    const user = await prisma.user.findUnique({
      where: { id: staffUserId },
    });

    if (!user || user.role !== 'OPD') {
      return NextResponse.json({ error: 'User tidak valid atau bukan OPD' }, { status: 400 });
    }

    // Cek apakah user sudah jadi staff OPD
    const existingOPD = await prisma.oPD.findUnique({
      where: { staffUserId },
    });

    if (existingOPD) {
      return NextResponse.json({ error: 'User ini sudah memiliki data OPD' }, { status: 400 });
    }

    // Simpan data OPD
    const newOpd = await prisma.oPD.create({
      data: {
        name,
        alamat: alamat || null,
        email: email || null,
        telp: telp || null,
        website: website || null,
        staffUserId,
      },
    });

    return NextResponse.json(newOpd);
  } catch (error) {
    console.error('❌ Gagal membuat data OPD:', error);
    return NextResponse.json({ error: 'Gagal membuat data OPD' }, { status: 500 });
  }
}
