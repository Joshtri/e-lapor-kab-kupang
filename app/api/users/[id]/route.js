import prisma from '@/lib/prisma'; // pastikan path prisma kamu benar
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
    });
  }

  try {
    // Ambil user detail
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        opd: true, // jika user ada relasi ke OPD
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Jika role PELAPOR, ambil laporan berdasarkan userId
    let reports = [];
    if (user.role === 'PELAPOR') {
      reports = await prisma.report.findMany({
        where: { userId: user.id },
        include: {
          opd: true, // bisa tambahkan relasi lainnya juga
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return new Response(
      JSON.stringify({
        user,
        reports, // kosong jika bukan pelapor
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
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