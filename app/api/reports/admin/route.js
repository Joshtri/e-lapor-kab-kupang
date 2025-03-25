import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
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
    console.error('Gagal mengambil data laporan:', error.message, error);
    return NextResponse.json(
      { message: 'Gagal mengambil data laporan.', error: error.message },
      { status: 500 },
    );
  }
}
