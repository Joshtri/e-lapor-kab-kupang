import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const report = await prisma.report.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        opd: {
          select: {
            id: true,
            name: true,
            email: true,
            telp: true,
            alamat: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { message: 'Laporan tidak ditemukan.' },
        { status: 404 },
      );
    }

    // ✅ Konversi image buffer ke base64 string
    const base64Image = report.image
      ? `data:image/jpeg;base64,${Buffer.from(report.image).toString('base64')}`
      : null;

    return NextResponse.json({
      id: report.id,
      title: report.title,
      priority: report.priority,
      description: report.description,
      kategori: report.category,
      subkategori: report.subcategory,
      pelapor: report.user?.name || 'Tidak diketahui',
      user: report.user,
      opd: report.opd || null,
      bupatiStatus: report.bupatiStatus,
      opdStatus: report.opdStatus,
      createdAt: report.createdAt,
      opdUpdatedAt: report.respondedAt || null,
      bupatiUpdatedAt: report.updatedAt || null,
      opdResponse: report.opdResponse || null,
      bupatiResponse: report.bupatiResponse || null,
      image: base64Image, // hasil konversi
    });
  } catch (error) {
    console.error('❌ Gagal ambil detail laporan:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data laporan.', error: error.message },
      { status: 500 },
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

    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
