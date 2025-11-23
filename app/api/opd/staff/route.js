import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { encrypt } from '@/lib/encryption';
import { getAuthenticatedUser } from '@/lib/auth';

/**
 * POST /api/opd/staff
 * Endpoint untuk menambahkan Staff OPD baru
 * Staff OPD harus menggunakan NIP (18 digit) bukan NIK (16 digit)
 */
export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hanya ADMIN yang bisa membuat staff OPD
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, nipNumber, contactNumber, email, password, opdId } =
      await req.json();

    // Validasi field wajib
    if (!name || !contactNumber || !email || !password || !nipNumber) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi termasuk NIP.' },
        { status: 400 },
      );
    }

    // Validasi panjang kontak
    if (contactNumber.length > 15) {
      return NextResponse.json(
        { error: 'Nomor kontak maksimal 15 digit.' },
        { status: 400 },
      );
    }

    // Validasi NIP harus 18 digit (berbeda dengan NIK yang 16 digit)
    const isValidNip = /^\d{18}$/.test(nipNumber);

    if (!isValidNip) {
      return NextResponse.json(
        { error: 'NIP harus 18 digit angka.' },
        { status: 400 },
      );
    }

    // Validasi OPD jika dipilih
    if (opdId) {
      const opdExists = await prisma.oPD.findUnique({
        where: { id: opdId },
      });

      if (!opdExists) {
        return NextResponse.json(
          { error: 'OPD tidak ditemukan.' },
          { status: 404 },
        );
      }
    }

    // Enkripsi NIP
    const encryptedNip = encrypt(nipNumber);

    // Cek apakah user dengan email atau NIP sudah ada
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nikNumber: encryptedNip }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email atau NIP sudah terdaftar.' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat staff OPD baru
    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contactNumber,
        role: 'OPD', // Tetapkan role sebagai OPD
        nikNumber: encryptedNip, // Meskipun field-nya nikNumber, untuk staff OPD isinya adalah NIP
        opdId: opdId || null, // Bisa null jika belum di-assign
      },
      include: {
        opd: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Staff OPD berhasil ditambahkan.',
        staff: {
          id: newStaff.id,
          name: newStaff.name,
          email: newStaff.email,
          role: newStaff.role,
          opd: newStaff.opd,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Gagal membuat staff OPD:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat staff OPD.' },
      { status: 500 },
    );
  }
}
