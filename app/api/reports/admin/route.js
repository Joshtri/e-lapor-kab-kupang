import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        opd: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedReports = reports.map((report) => ({
      id: report.id,
      title: report.title,
      description: report.description,
      status: report.status,
      priority: report.priority,
      category: report.category,
      createdAt: report.createdAt,
      user: {
        name: report.user?.name || 'Tidak diketahui',
        email: report.user?.email || '-',
      },
      opd: {
        name: report.opd?.name || 'Tidak diketahui',
      },
    }));

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error('❌ Gagal mengambil data laporan:', error.message, error);
    return NextResponse.json(
      { message: 'Gagal mengambil data laporan.', error: error.message },
      { status: 500 },
    );
  }
}
