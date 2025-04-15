import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { decrypt, encrypt } from '@/lib/encryption';

export async function POST(req) {
  try {
    const { name, nikNumber, contactNumber, email, password, role } =
      await req.json();

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

    // Validasi panjang dan format NIK berdasarkan role
    const isValidNik =
      (role === 'OPD' && /^\d{18}$/.test(nikNumber)) ||
      (role !== 'OPD' && /^\d{16}$/.test(nikNumber));

    if (!isValidNik) {
      return NextResponse.json(
        {
          error:
            role === 'OPD'
              ? 'NIK OPD harus 18 digit angka.'
              : 'NIK harus 16 digit angka.',
        },
        { status: 400 },
      );
    }

    // Enkripsi NIK
    const encryptedNik = encrypt(nikNumber);

    // Cek user existing
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nikNumber: encryptedNik }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email atau NIK sudah terdaftar.' },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contactNumber,
        role,
        nikNumber: encryptedNik,
      },
    });

    return NextResponse.json(
      {
        message: 'User berhasil dibuat.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 },
    );
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

    const result = users.map((user) => ({
      ...user,
      nikNumber: decrypt(user.nikNumber), // aman, fallback jika error
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Gagal mengambil data users:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data users.' },
      { status: 500 },
    );
  }
}
