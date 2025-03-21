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

export async function POST(req) {
  try {
    const data = await req.json();

    // ✅ Buat Laporan Baru
    const newReport = await prisma.report.create({
      data: {
        userId: data.userId, // Pastikan ID user dikirim sebagai INT
        title: data.title,
        category: data.category,
        priority: data.priority,
        description: data.description,
        status: "PENDING", // Default status
      },
    });

    // ✅ Cari semua pengguna dengan role ADMIN & BUPATI
    const adminsAndBupati = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "BUPATI"] }, // Ambil semua Admin dan Bupati
      },
      select: { id: true, role: true }, // ✅ Ambil juga role mereka
    });

    // ✅ Buat Notifikasi untuk setiap Admin & Bupati
    const notifications = adminsAndBupati.map((user) => {
      const basePath =
        user.role === "ADMIN"
          ? "/adm/report-warga"
          : "/bupati-portal/laporan-warga";

      return {
        userId: user.id,
        message: `Laporan baru: "${newReport.title}" telah dibuat.`,
        link: `${basePath}/${newReport.id}`, // ✅ Sesuaikan dengan role
        createdAt: new Date(), // ✅ Tambahkan timestamp
      };
    });

    // ✅ Simpan notifikasi ke database
    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications,
      });
    }

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 Memperbarui Status Laporan (Hanya untuk Bupati)
export async function PUT(req) {
  try {
    const { id, status } = await req.json();

    if (!["PENDING", "PROSES", "SUKSES"].includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 },
      );
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui status laporan" },
      { status: 500 },
    );
  }
}



