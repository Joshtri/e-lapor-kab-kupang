import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Hitung total laporan berdasarkan status
    const totalReports = await prisma.report.count();
    const inProgress = await prisma.report.count({ where: { status: "PROSES" } });
    const completed = await prisma.report.count({ where: { status: "SELESAI" } });
    const rejected = await prisma.report.count({ where: { status: "DITOLAK" } });

    // Hitung total pengguna
    const totalUsers = await prisma.user.count();
    const totalPelapor = await prisma.user.count({ where: { role: "PELAPOR" } });
    const totalAdmin = await prisma.user.count({ where: { role: "ADMIN" } });
    const totalBupati = await prisma.user.count({ where: { role: "BUPATI" } });

    // Hitung total komentar pada laporan
    const totalComments = await prisma.comment.count();

    // Statistik laporan per kategori
    const categoryStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT category, COUNT(*)::int AS total
      FROM "Report"
      GROUP BY category
      ORDER BY total DESC
    `);
    const categoryStats = categoryStatsRaw || [];

    // Data grafik laporan per bulan
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

    // Ambil 5 laporan terbaru
    const recentReportsRaw = await prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });

    const recentReports = (recentReportsRaw || []).map((report) => ({
      id: report.id,
      pelapor: report.user?.name || "Tidak diketahui",
      kategori: report.category,
      status: report.status,
    }));

    return NextResponse.json({
      stats: {
        totalReports,
        inProgress,
        completed,
        rejected,
        totalUsers,
        totalPelapor,
        totalAdmin,
        totalBupati,
        totalComments,
      },
      categoryStats,
      chartData,
      recentReports,
    });
  } catch (error) {
    console.error("Error fetching admin summary:", error.message, error);
    return NextResponse.json(
      { message: "Gagal mengambil data admin summary.", error: error.message },
      { status: 500 },
    );
  }
}
