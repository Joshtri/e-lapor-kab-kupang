import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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
    console.error("Error fetching chart data:", error.message, error);
    return NextResponse.json(
      { message: "Gagal mengambil data grafik laporan.", error: error.message },
      { status: 500 },
    );
  }
}
