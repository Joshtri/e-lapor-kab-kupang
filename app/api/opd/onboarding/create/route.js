import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { staffUserId, name, alamat, email, telp, website } = body;

    if (!staffUserId || !name || !email || !telp) {
      return NextResponse.json(
        { error: 'Field wajib tidak boleh kosong.' },
        { status: 400 },
      );
    }

    // Check if user exists and has role OPD
    const user = await prisma.user.findUnique({
      where: { id: staffUserId },
    });

    if (!user || user.role !== 'OPD') {
      return NextResponse.json(
        { error: 'User tidak valid atau bukan OPD' },
        { status: 400 },
      );
    }

    // Check if user already has OPD profile
    if (user.opdId) {
      return NextResponse.json(
        { error: 'Profil OPD sudah ada.' },
        { status: 409 },
      );
    }

    const created = await prisma.oPD.create({
      data: {
        name,
        alamat,
        email,
        telp,
        website,
      },
    });

    // Update user with opdId
    await prisma.user.update({
      where: { id: staffUserId },
      data: { opdId: created.id },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    'Gagal membuat profil OPD:', error;
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan profil OPD.' },
      { status: 500 },
    );
  }
}
