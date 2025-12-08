import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  try {
    // ✅ Validasi JWT dari req
    const user = await getAuthenticatedUser(req);
    if (!user || !['ADMIN', 'BUPATI'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Ambil parameter bulan dan kategori
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

    // ✅ Gunakan query raw dengan JOIN ke ReportCategory untuk data dinamis
    const dailyCategoryStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT
        TO_CHAR(r."createdAt", 'DD Mon') AS day,
        COUNT(*)::int AS total,
        COALESCE(rc.name, r.category, 'Tidak Berkategori') AS category
      FROM "Report" r
      LEFT JOIN "ReportCategory" rc ON r."categoryId" = rc.id
      WHERE r."createdAt" >= '${startDate.toISOString()}'
        AND r."createdAt" < '${endDate.toISOString()}'
        ${category !== 'ALL' ? `AND COALESCE(rc.name, r.category) = '${category}'` : ''}
      GROUP BY day, rc.name, r.category, DATE_TRUNC('day', r."createdAt")
      ORDER BY DATE_TRUNC('day', r."createdAt") ASC
    `);

    return NextResponse.json({ dailyCategoryStats: dailyCategoryStatsRaw });
  } catch (error) {
    (
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
