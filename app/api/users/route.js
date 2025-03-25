import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

// 📌 Create User
export async function POST(req) {
  try {
    const { name, nikNumber, contactNumber, email, password, role } =
      await req.json();

    // Validasi field wajib
    if (!name || !contactNumber || !email || !password || !role || !nikNumber) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi termasuk NIK.' },
        { status: 400 },
      );
    }

    if (contactNumber.length > 15) {
      return NextResponse.json(
        { error: 'Nomor kontak maksimal 15 digit.' },
        { status: 400 },
      );
    }

    // Validasi NIK (wajib, 16 digit, hanya angka)
    if (nikNumber.length !== 16) {
      return NextResponse.json(
        { error: 'NIK harus terdiri dari 16 digit.' },
        { status: 400 },
      );
    }

    if (!/^\d{16}$/.test(nikNumber)) {
      return NextResponse.json(
        { error: 'NIK hanya boleh berisi angka.' },
        { status: 400 },
      );
    }

    // Cek user existing
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nikNumber }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email atau NIK sudah terdaftar.' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contactNumber,
        role,
        nikNumber,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Gagal membuat user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat user.' },
      { status: 500 },
    );
  }
}

// 📌 GET (optional, kalau mau list semua user)

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        nikNumber: true,
        contactNumber: true,
        email: true,
        role: true,
        createdAt: true,
        opd: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Gagal mengambil data users:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data users.' },
      { status: 500 },
    );
  }
}
