import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalReports = await prisma.report.count();
    const inProgress = await prisma.report.count({
      where: { status: "PROSES" },
    });
    const completed = await prisma.report.count({
      where: { status: "SELESAI" },
    });
    const totalUsers = await prisma.user.count();

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

    const recentReportsRaw = await prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
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
        totalUsers,
      },
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
