import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const report = await prisma.report.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ message: "Laporan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      id: report.id,
      title: report.title,
      priority: report.priority,
      description: report.description,
      pelapor: report.user?.name || "Tidak diketahui",
      kategori: report.category,
      status: report.status,
      createdAt: report.createdAt,
    });
  } catch (error) {
    console.error("Error fetching report details:", error.message, error);
    return NextResponse.json(
      { message: "Gagal mengambil data laporan.", error: error.message },
      { status: 500 }
    );
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
