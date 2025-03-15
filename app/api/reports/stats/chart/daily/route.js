import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Ambil parameter bulan dari query (format: YYYY-MM)
    const url = new URL(req.url);
    const month = url.searchParams.get("month") || new Date().toISOString().slice(0, 7); // Default: bulan ini

    const dailyReportStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM-DD') AS day, 
        COUNT(*)::int AS total
      FROM "Report"
      WHERE TO_CHAR("createdAt", 'YYYY-MM') = $1
      GROUP BY day
      ORDER BY day ASC
    `, month);

    return NextResponse.json({ dailyReportStats: dailyReportStatsRaw || [] });
  } catch (error) {
    console.error("Error fetching daily report chart data:", error.message, error);
    return NextResponse.json(
      { message: "Gagal mengambil data grafik laporan harian.", error: error.message },
      { status: 500 }
    );
  }
}
