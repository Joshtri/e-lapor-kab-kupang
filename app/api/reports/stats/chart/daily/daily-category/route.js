import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const category = searchParams.get("category") || "ALL";

    if (!month) {
      return NextResponse.json(
        { message: "Parameter 'month' wajib diisi." },
        { status: 400 }
      );
    }

    let whereClause = {
      createdAt: {
        gte: new Date(`${month}-01T00:00:00Z`),
        lt: new Date(`${month}-31T23:59:59Z`),
      },
    };

    if (category !== "ALL") {
      whereClause.category = category;
    }

    const dailyCategoryStatsRaw = await prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR("createdAt", 'DD Mon') AS day, 
        COUNT(*)::int AS total,
        "category"
      FROM "Report"
      WHERE "createdAt" >= '${whereClause.createdAt.gte.toISOString()}'
        AND "createdAt" < '${whereClause.createdAt.lt.toISOString()}'
        ${category !== "ALL" ? `AND "category" = '${category}'` : ""}
      GROUP BY day, category, DATE_TRUNC('day', "createdAt")
      ORDER BY DATE_TRUNC('day', "createdAt") ASC
    `);

    return NextResponse.json({ dailyCategoryStats: dailyCategoryStatsRaw });
  } catch (error) {
    console.error(
      "Error fetching daily category report stats:",
      error.message,
      error
    );
    return NextResponse.json(
      {
        message: "Gagal mengambil data laporan harian berdasarkan kategori.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
