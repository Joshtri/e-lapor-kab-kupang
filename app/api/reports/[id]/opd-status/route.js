import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { opdStatus } = body; // ✅ ambil field yg benar

  if (!opdStatus) {
    return NextResponse.json(
      { error: 'Status OPD diperlukan.' },
      { status: 400 },
    );
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: { opdStatus }, // ✅ pakai field yang benar dari model kamu
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Gagal update opdStatus:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui status OPD.' },
      { status: 500 },
    );
  }
}
