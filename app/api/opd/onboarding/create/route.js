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

    const existing = await prisma.oPD.findUnique({
      where: { staffUserId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Profil OPD sudah ada.' },
        { status: 409 },
      );
    }

    const created = await prisma.oPD.create({
      data: {
        staffUserId,
        name,
        alamat,
        email,
        telp,
        website,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Gagal membuat profil OPD:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan profil OPD.' },
      { status: 500 },
    );
  }
}
