import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Hitung total laporan berdasarkan status
    const totalReports = await prisma.report.count();
    const inProgress = await prisma.report.count({
      where: { bupatiStatus: 'PROSES' },
    });
    const completed = await prisma.report.count({
      where: { bupatiStatus: 'SELESAI' },
    });
    const rejected = await prisma.report.count({
      where: { bupatiStatus: 'DITOLAK' },
    });

    // Hitung total pengguna
    const totalUsers = await prisma.user.count();
    const totalPelapor = await prisma.user.count({
      where: { role: 'PELAPOR' },
    });
    const totalAdmin = await prisma.user.count({ where: { role: 'ADMIN' } });
    const totalBupati = await prisma.user.count({ where: { role: 'BUPATI' } });

    // Hitung total komentar
    const totalComments = await prisma.comment.count();

    return NextResponse.json({
      stats: {
        totalReports,
        inProgress,
        completed,
        rejected,
        totalUsers,
        totalPelapor,
        totalAdmin,
        totalBupati,
        totalComments,
      },
    });
  } catch (error) {
    'Error fetching admin summary:', error.message, error;
    return NextResponse.json(
      { message: 'Gagal mengambil data statistik umum.', error: error.message },
      { status: 500 },
    );
  }
}
