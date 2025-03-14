import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const priorityStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT priority, COUNT(*)::int AS total
      FROM "Report"
      GROUP BY priority
      ORDER BY total DESC
    `);
    const priorityStats = priorityStatsRaw || [];

    return NextResponse.json({ priorityStats });
  } catch (error) {
        console.error("Error fetching priority chart data:", error.message, error);
        return NextResponse.json(
      { message: "Gagal mengambil data grafik prioritas laporan.", error: error.message },
      { status: 500 },
    );
  }
}
