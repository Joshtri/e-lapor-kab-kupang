import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || !['ADMIN', 'BUPATI', 'OPD'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Query dengan JOIN ke ReportCategory untuk data dinamis
    const categoryStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(rc.name, r.category, 'Tidak Berkategori') AS category,
        COUNT(*)::int AS total
      FROM "Report" r
      LEFT JOIN "ReportCategory" rc ON r."categoryId" = rc.id
      GROUP BY rc.name, r.category
      ORDER BY total DESC
    `);

    const categoryStats = categoryStatsRaw || [];

    return NextResponse.json({ categoryStats });
  } catch (error) {
    '❌ Error fetching category stats:', error.message, error;
    return NextResponse.json(
      { message: 'Gagal mengambil statistik kategori.', error: error.message },
      { status: 500 },
    );
  }
}
