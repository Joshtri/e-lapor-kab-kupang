import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  try {
    // ✅ Auth check
    const user = await getAuthenticatedUser(req);
    if (!user || !['ADMIN', 'BUPATI'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Ambil query param bulan (YYYY-MM)
    const url = new URL(req.url);
    const month =
      url.searchParams.get('month') || new Date().toISOString().slice(0, 7); // Default: bulan ini

    const dailyReportStatsRaw = await prisma.$queryRawUnsafe(
      `
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM-DD') AS day, 
        COUNT(*)::int AS total
      FROM "Report"
      WHERE TO_CHAR("createdAt", 'YYYY-MM') = $1
      GROUP BY day
      ORDER BY day ASC
      `,
      month,
    );

    return NextResponse.json({ dailyReportStats: dailyReportStatsRaw || [] });
  } catch (error) {
    '❌ Error fetching daily report chart data:', error.message;
    return NextResponse.json(
      {
        message: 'Gagal mengambil data grafik laporan harian.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
