import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan prisma sudah dikonfigurasi

export async function GET(req) {
  try {
    // Ambil query parameter dari URL
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get("reportId");

    if (!reportId) {
      return NextResponse.json(
        { message: "reportId diperlukan dalam query parameter." },
        { status: 400 }
      );
    }

    // Ambil komentar berdasarkan reportId dan hanya dari user dengan role "BUPATI"
    const comments = await prisma.comment.findMany({
      where: { reportId: Number(reportId), user: { role: "BUPATI" } },
      include: { user: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "desc" }, // Urutkan dari terbaru ke terlama
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Gagal mengambil komentar.", error: error.message },
      { status: 500 }
    );
  }
}
