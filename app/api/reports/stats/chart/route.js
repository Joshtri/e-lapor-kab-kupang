import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user || !['ADMIN', 'BUPATI'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chartDataRaw = await prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR("createdAt", 'Mon YYYY') AS month, 
        COUNT(*)::int AS total
      FROM "Report"
      GROUP BY month, DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") DESC
      LIMIT 6
    `);

    const chartData = (chartDataRaw || []).reverse();

    return NextResponse.json({ chartData });
  } catch (error) {
    '❌ Error fetching monthly chart data:', error.message;
    return NextResponse.json(
      {
        message: 'Gagal mengambil data grafik laporan.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
