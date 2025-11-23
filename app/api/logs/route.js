import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 📌 1. Menambahkan Log Baru
export async function POST(req) {
  try {
    const body = await req.json();
    const newLog = await prisma.log.create({
      data: body,
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menambahkan log" },
      { status: 500 },
    );
  }
}

// 📌 2. Mengambil Semua Log
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get("reportId"); // Ambil filter jika ada

    const logs = await prisma.log.findMany({
      where: reportId ? { reportId } : {},
      include: {
        user: { select: { id: true, name: true, email: true } },
        report: { select: { id: true, title: true } },
      },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil log" }, { status: 500 });
  }
}
