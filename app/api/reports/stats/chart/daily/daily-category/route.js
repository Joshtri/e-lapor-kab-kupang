import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromCookie();
    if (!user || !['ADMIN', 'BUPATI'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const category = searchParams.get('category') || 'ALL';

    if (!month) {
      return NextResponse.json(
        { message: "Parameter 'month' wajib diisi." },
        { status: 400 },
      );
    }

    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const dailyCategoryStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR("createdAt", 'DD Mon') AS day, 
        COUNT(*)::int AS total,
        "category"
      FROM "Report"
      WHERE "createdAt" >= '${startDate.toISOString()}'
        AND "createdAt" < '${endDate.toISOString()}'
        ${category !== 'ALL' ? `AND "category" = '${category}'` : ''}
      GROUP BY day, category, DATE_TRUNC('day', "createdAt")
      ORDER BY DATE_TRUNC('day', "createdAt") ASC
    `);

    return NextResponse.json({ dailyCategoryStats: dailyCategoryStatsRaw });
  } catch (error) {
    console.error(
      '❌ Error fetching daily category report stats:',
      error.message,
      error,
    );
    return NextResponse.json(
      {
        message: 'Gagal mengambil data laporan harian berdasarkan kategori.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
