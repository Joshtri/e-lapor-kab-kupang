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
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Ambil laporan jika pelapor
    let reports = [];
    if (user.role === 'PELAPOR') {
      reports = await prisma.report.findMany({
        where: { userId: user.id },
        include: { opd: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    // ⬅️ Tambahkan masking langsung ke dalam user
    const userWithMaskedNik = {
      ...user,
      nikMasked: getMaskedNik(user.nikNumber),
    };

    return NextResponse.json({ user: userWithMaskedNik, reports });
  } catch (error) {
    console.error('❌ Error fetching user detail:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
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
    console.error('❌ Error deleting user:', error);
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
    const { name, email, contactNumber, role, nikNumber, password } = await req.json();

    if (!name || !email || !role || !nikNumber) {
      return NextResponse.json(
        { error: 'Field nama, email, role, dan NIK wajib diisi.' },
        { status: 400 }
      );
    }

    // Validasi format NIK
    const isValidNik =
      (role === 'OPD' && /^\d{18}$/.test(nikNumber)) ||
      (role !== 'OPD' && /^\d{16}$/.test(nikNumber));

    if (!isValidNik) {
      return NextResponse.json(
        {
          error:
            role === 'OPD'
              ? 'NIP OPD harus 18 digit angka.'
              : 'NIK harus 16 digit angka.',
        },
        { status: 400 }
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
    console.error('Gagal mengupdate user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate user.' },
      { status: 500 }
    );
  }
}
