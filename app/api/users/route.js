import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { decrypt, encrypt } from '@/lib/encryption';
 import { getMaskedNik } from '@/utils/mask';
 import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req) {
  try {

    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
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
    const isValidNik = /^\d{16}$/.test(nikNumber) || /^\d{18}$/.test(nikNumber);

    if (!isValidNik) {
      return NextResponse.json(
        { error: 'NIK/NIP harus 16 atau 18 digit angka.' },
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



export async function GET(req) {
  const user = await getAuthenticatedUser(req);

  // Proteksi: hanya ADMIN yang boleh akses
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    const result = users.map((user) => {
      let decryptedNik = user.nikNumber;

      try {
        if (typeof user.nikNumber === 'string' && user.nikNumber.includes(':')) {
          decryptedNik = decrypt(user.nikNumber);
        }
      } catch (e) {
        console.warn('❌ Gagal decrypt nikNumber user:', user.id);
      }

      return {
        ...user,
        nikNumber: user.nikNumber, // tetap terenkripsi
        nikMasked: decryptedNik ? getMaskedNik(decryptedNik) : null,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Gagal mengambil data users:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data users.' },
      { status: 500 }
    );
  }
}
