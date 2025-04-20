import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const { id } = params;
  const { opdId } = await req.json();

  if (!opdId) {
    return NextResponse.json({ error: 'OPD ID wajib diisi.' }, { status: 400 });
  }

  try {
    // Validasi apakah OPD ada
    const opd = await prisma.oPD.findUnique({
      where: { id: Number(opdId) },
    });

    if (!opd) {
      return NextResponse.json(
        { error: 'OPD tidak ditemukan.' },
        { status: 404 },
      );
    }

    // Update laporan
    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: {
        opdId: Number(opdId),
        isReadByOpd: false,
        assignedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        opd: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'OPD berhasil diperbarui.',
      report: updatedReport,
    });
  } catch (error) {
    '[UPDATE_REPORT_OPD_ERROR]', error;
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate laporan.' },
      { status: 500 },
    );
  }
}
