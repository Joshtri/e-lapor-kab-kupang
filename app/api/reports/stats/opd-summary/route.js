import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id;
    const role = decoded?.role;

    if (!userId || role !== 'OPD') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const opd = await prisma.oPD.findUnique({
      where: { staffUserId: userId },
    });

    // 🔒 Cek jika user belum punya profil OPD
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
