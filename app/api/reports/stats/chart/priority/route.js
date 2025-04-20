import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || !['ADMIN', 'BUPATI'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const priorityStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT priority, COUNT(*)::int AS total
      FROM "Report"
      GROUP BY priority
      ORDER BY total DESC
    `);

    return NextResponse.json({ priorityStats: priorityStatsRaw || [] });
  } catch (error) {
    (
      '❌ Error fetching priority chart data:',
      error.message,
      error,
    );
    return NextResponse.json(
      {
        message: 'Gagal mengambil data grafik prioritas laporan.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
