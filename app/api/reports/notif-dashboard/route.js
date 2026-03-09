import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Hitung tanggal 14 hari (2 minggu) ke belakang
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const reports = await prisma.report.findMany({
      where: {
        createdAt: {
          gte: twoWeeksAgo, // ✅ hanya laporan dari 14 hari terakhir
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5, // opsional: batasi jumlah
      select: {
        id: true,
        title: true,
        description: true,
        category: true, // Legacy field
        subcategory: true, // Legacy field
        reportCategory: { // ✅ New relational field
          select: { id: true, name: true },
        },
        reportSubcategory: { // ✅ New relational field
          select: { id: true, name: true },
        },
        priority: true,
        bupatiStatus: true,
        opdStatus: true,
        createdAt: true,
        updatedAt: true,
        isReadByBupati: true,
        isReadByOpd: true,
        user: { select: { id: true, name: true } },
        opd: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    '[GET_REPORTS_NOTIF_DASHBOARD]', error;
    return NextResponse.json(
      { error: 'Gagal mengambil data notifikasi laporan.' },
      { status: 500 },
    );
  }
}
