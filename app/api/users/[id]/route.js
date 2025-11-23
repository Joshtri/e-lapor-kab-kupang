import prisma from '@/lib/prisma'; // pastikan path prisma kamu benar
import { NextResponse } from 'next/server';
import { getMaskedNik } from '@/utils/mask';
import { encrypt, decrypt } from '@/lib/encryption';
import bcrypt from 'bcrypt';

export async function GET(req, { params }) {
  const userId = params.id;

  if (!userId || typeof userId !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        opd: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ambil laporan jika pelapor (exclude image blob untuk performa)
    let reports = [];
    if (user.role === 'PELAPOR') {
      reports = await prisma.report.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          title: true,
          category: true,
          priority: true,
          bupatiStatus: true,
          opdStatus: true,
          createdAt: true,
          opd: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Decrypt NIK/NIP untuk keperluan edit, dan tambahkan masking untuk display
    let decryptedNik = '';
    let decryptedNip = '';

    // Decrypt nikNumber (for PELAPOR, ADMIN, BUPATI)
    try {
      if (user.nikNumber && user.nikNumber.includes(':')) {
        decryptedNik = decrypt(user.nikNumber);
      } else {
        decryptedNik = user.nikNumber || '';
      }
    } catch (error) {
      console.warn('Failed to decrypt nikNumber:', error);
      decryptedNik = '';
    }

    // Decrypt nipNumber (for OPD staff)
    try {
      if (user.nipNumber && user.nipNumber.includes(':')) {
        decryptedNip = decrypt(user.nipNumber);
      } else {
        decryptedNip = user.nipNumber || '';
      }
    } catch (error) {
      console.warn('Failed to decrypt nipNumber:', error);
      decryptedNip = '';
    }

    const userWithNikData = {
      ...user,
      nikMasked: getMaskedNik(user.nikNumber),
      nipMasked: getMaskedNik(user.nipNumber),
      nikDecrypted: decryptedNik, // For edit forms (PELAPOR, ADMIN, BUPATI)
      nipDecrypted: decryptedNip, // For edit forms (OPD staff)
    };

    return NextResponse.json({ user: userWithNikData, reports }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching user detail:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(_req, { params }) {
  const userId = params.id;

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
  }

  try {
    // Hapus user (otomatis akan error kalau masih ada foreign key constraint)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    '❌ Error deleting user:', error;
    return NextResponse.json(
      {
        error:
          error.code === 'P2025'
            ? 'User tidak ditemukan'
            : 'Gagal menghapus user',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { name, email, contactNumber, role, nikNumber, nipNumber, password, opdId } =
      await req.json();

    // Staff OPD uses nipNumber (18 digits), others use nikNumber (16 digits)
    const identityNumber = role === 'OPD' ? nipNumber : nikNumber;

    if (!name || !email || !role || !identityNumber) {
      return NextResponse.json(
        { error: 'Field nama, email, role, dan nomor identitas wajib diisi.' },
        { status: 400 },
      );
    }

    // Validasi format NIK (16) atau NIP (18)
    const isValidIdentitas =
      /^\d{16}$/.test(identityNumber) || /^\d{18}$/.test(identityNumber);

    if (!isValidIdentitas) {
      return NextResponse.json(
        { error: 'Nomor identitas harus terdiri dari 16 atau 18 digit angka.' },
        { status: 400 },
      );
    }

    const encryptedIdentity = encrypt(identityNumber);

    // Jika password diisi, hash ulang
    let updatedData = {
      name,
      email,
      contactNumber,
      role,
    };

    // Set nikNumber or nipNumber based on role
    if (role === 'OPD') {
      updatedData.nipNumber = encryptedIdentity;
      updatedData.nikNumber = null; // Clear nikNumber for OPD
      // Handle opdId (can be null or empty string to unassign)
      updatedData.opdId = opdId === '' || opdId === null ? null : opdId;
    } else {
      updatedData.nikNumber = encryptedIdentity;
      updatedData.nipNumber = null; // Clear nipNumber for non-OPD
      updatedData.opdId = null; // Non-OPD users don't have opdId
    }

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({
      message: 'User berhasil diperbarui.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Gagal mengupdate user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate user.' },
      { status: 500 },
    );
  }
}
