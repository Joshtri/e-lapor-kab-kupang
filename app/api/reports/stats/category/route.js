import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categoryStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT category, COUNT(*)::int AS total
      FROM "Report"
      GROUP BY category
      ORDER BY total DESC
    `);
    const categoryStats = categoryStatsRaw || [];

    return NextResponse.json({ categoryStats });
  } catch (error) {
    console.error("Error fetching category stats:", error.message, error);
    return NextResponse.json(
      { message: "Gagal mengambil statistik kategori.", error: error.message },
      { status: 500 },
    );
  }
}
