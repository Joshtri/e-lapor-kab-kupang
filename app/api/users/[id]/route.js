import prisma from '@/lib/prisma'; // pastikan path prisma kamu benar
import { NextResponse } from 'next/server';
import { getMaskedNik } from '@/utils/mask';
import { encrypt } from '@/lib/encryption';
import bcrypt from 'bcrypt';

export async function GET(req, { params }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
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

    // Tambahkan masking ke dalam user
    const userWithMaskedNik = {
      ...user,
      nikMasked: getMaskedNik(user.nikNumber),
    };

    return NextResponse.json({ user: userWithMaskedNik, reports }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching user detail:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(_req, { params }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
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
    const { name, email, contactNumber, role, nikNumber, password } =
      await req.json();

    if (!name || !email || !role || !nikNumber) {
      return NextResponse.json(
        { error: 'Field nama, email, role, dan NIK wajib diisi.' },
        { status: 400 },
      );
    }

    // Validasi format NIK
    const isValidIdentitas =
      /^\d{16}$/.test(nikNumber) || /^\d{18}$/.test(nikNumber);

    if (!isValidIdentitas) {
      return NextResponse.json(
        { error: 'Nomor identitas harus terdiri dari 16 atau 18 digit angka.' },
        { status: 400 },
      );
    }

    const encryptedNik = encrypt(nikNumber);

    // Jika password diisi, hash ulang
    let updatedData = {
      name,
      email,
      contactNumber,
      role,
      nikNumber: encryptedNik,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
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
    'Gagal mengupdate user:', error;
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate user.' },
      { status: 500 },
    );
  }
}
