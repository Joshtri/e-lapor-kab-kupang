import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 📌 API untuk menghitung jumlah laporan berdasarkan status
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // Opsional, jika ada maka filter berdasarkan user

    const whereClause = userId ? { userId: parseInt(userId) } : {}; // Filter jika ada userId

    // Hitung jumlah laporan berdasarkan status
    const pending = await prisma.report.count({ where: { ...whereClause, status: "PENDING" } });
    const inProgress = await prisma.report.count({ where: { ...whereClause, status: "PROSES" } });
    const completed = await prisma.report.count({ where: { ...whereClause, status: "SELESAI" } });
    const rejected = await prisma.report.count({ where: { ...whereClause, status: "DITOLAK" } });

    const total = pending + inProgress + completed + rejected;

    return NextResponse.json({ total, pending, inProgress, completed }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghitung laporan" }, { status: 500 });
  }
}
 