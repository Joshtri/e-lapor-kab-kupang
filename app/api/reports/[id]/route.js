import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 📌 Ambil Detail Pengaduan Berdasarkan ID
export async function GET(req, { params }) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        comments: { include: { user: { select: { name: true } } } },
      },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 Update Laporan Berdasarkan ID
export async function PUT(req, { params }) {
  try {
    const updateData = await req.json();
    const updatedReport = await prisma.report.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 Hapus Laporan
export async function DELETE(req, { params }) {
  try {
    await prisma.report.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
