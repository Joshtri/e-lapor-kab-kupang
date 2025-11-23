import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'OPD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { opd: true },
    });

    if (!userData?.opd) {
      return NextResponse.json(
        { error: 'Profil OPD belum lengkap', code: 'NO_PROFILE' },
        { status: 403 },
      );
    }

    const reports = await prisma.report.findMany({
      where: { opdId: userData.opd.id },
    });

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const grouped = {
      totalMasuk: reports.length,
      totalSelesai: reports.filter((r) => r.opdStatus === 'SELESAI').length,
      totalProses: reports.filter((r) => r.opdStatus === 'PROSES').length,
      totalDitolak: reports.filter((r) => r.opdStatus === 'DITOLAK').length,
      totalPelapor: new Set(reports.map((r) => r.userId)).size,
      laporanBaru: reports.filter((r) => new Date(r.createdAt) > yesterday)
        .length,
      laporanTertundaLebih7Hari: reports.filter(
        (r) =>
          r.opdStatus === 'PENDING' && new Date(r.createdAt) < sevenDaysAgo,
      ).length,
      avgHandlingTime: null,
      distribusiPrioritas: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
      },
    };

    // Hitung waktu rata-rata penanganan
    const selesaiReports = reports.filter(
      (r) => r.opdStatus === 'SELESAI' && r.assignedAt && r.respondedAt,
    );

    if (selesaiReports.length > 0) {
      const totalTime = selesaiReports.reduce((acc, curr) => {
        const duration =
          (new Date(curr.respondedAt) - new Date(curr.assignedAt)) /
          (1000 * 60 * 60 * 24);
        return acc + duration;
      }, 0);
      grouped.avgHandlingTime = parseFloat(
        (totalTime / selesaiReports.length).toFixed(1),
      );
    }

    // Hitung distribusi prioritas
    for (const report of reports) {
      if (report.priority in grouped.distribusiPrioritas) {
        grouped.distribusiPrioritas[report.priority]++;
      }
    }

    return NextResponse.json(grouped);
  } catch (error) {
    'Error:', error;
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
