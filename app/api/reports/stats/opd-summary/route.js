import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'OPD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const opd = await prisma.oPD.findUnique({
      where: { staffUserId: user.id },
    });

    if (!opd) {
      return NextResponse.json(
        { error: 'Profil OPD belum lengkap', code: 'NO_PROFILE' },
        { status: 403 },
      );
    }

    const reports = await prisma.report.findMany({
      where: { opdId: opd.id },
    });

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const grouped = {
      totalMasuk: reports.length,
      totalSelesai: reports.filter((r) => r.opdStatus === 'SELESAI').length,
      totalProses: reports.filter((r) => r.opdStatus === 'PROSES').length,
      totalDitolak: reports.filter((r) => r.opdStatus === 'DITOLAK').length,
      totalPelapor: new Set(reports.map((r) => r.userId)).size,
      laporanBaru: reports.filter((r) => new Date(r.createdAt) > yesterday)
        .length,
      avgHandlingTime: null,
    };

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
      grouped.avgHandlingTime = (totalTime / selesaiReports.length).toFixed(1);
    }

    return NextResponse.json(grouped);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
