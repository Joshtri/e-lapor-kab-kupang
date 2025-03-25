// /app/api/opd/dashboard/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('auth_token')?.value;
  const decoded = verify(token, process.env.JWT_SECRET);

  const opd = await prisma.oPD.findUnique({
    where: { staffUserId: decoded.id },
  });

  const reports = await prisma.report.findMany({
    where: { opdId: opd.id },
  });

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const grouped = {
    totalMasuk: reports.length,
    totalSelesai: reports.filter(r => r.opdStatus === 'SELESAI').length,
    totalProses: reports.filter(r => r.opdStatus === 'PROSES').length,
    totalDitolak: reports.filter(r => r.opdStatus === 'DITOLAK').length,
    totalPelapor: new Set(reports.map(r => r.userId)).size,
    laporanBaru: reports.filter(r => new Date(r.createdAt) > yesterday).length,
    avgHandlingTime: null,
  };

  // Hitung rata-rata waktu penanganan
  const selesaiReports = reports.filter(r => r.opdStatus === 'SELESAI' && r.assignedAt && r.respondedAt);
  if (selesaiReports.length > 0) {
    const totalTime = selesaiReports.reduce((acc, curr) => {
      const duration = (new Date(curr.respondedAt) - new Date(curr.assignedAt)) / (1000 * 60 * 60 * 24);
      return acc + duration;
    }, 0);
    grouped.avgHandlingTime = (totalTime / selesaiReports.length).toFixed(1);
  }

  return NextResponse.json(grouped);
}
