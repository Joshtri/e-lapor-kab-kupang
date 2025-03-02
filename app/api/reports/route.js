import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 📌 Ambil Semua Pengaduan
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const reports = await prisma.report.findMany({
      where: userId ? { userId: Number(userId) } : {},
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 Buat Pengaduan Baru
export async function POST(req) {
  try {
    const data = await req.json();
    const newReport = await prisma.report.create({ data });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 Memperbarui Status Laporan (Hanya untuk Bupati)
export async function PUT(req) {
  try {
    const { id, status } = await req.json();

    if (!["PENDING", "PROSES", "SUKSES"].includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui status laporan" }, { status: 500 });
  }
}
