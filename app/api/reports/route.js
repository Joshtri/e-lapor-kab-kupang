import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 📌 Ambil Semua Pengaduan
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        comments: true,
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
