import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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

    return NextResponse.json({ recentReports });
  } catch (error) {
    console.error("Error fetching recent reports:", error.message, error);
    return NextResponse.json(
      { message: "Gagal mengambil laporan terbaru.", error: error.message },
      { status: 500 },
    );
  }
}
