import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const report = await prisma.report.findUnique({
      where: { id: Number(id) },
      select: { image: true },
    });

    if (!report || !report.image) {
      return NextResponse.json(
        { message: 'Gambar tidak ditemukan' },
        { status: 404 },
      );
    }

    const base64Image = `data:image/jpeg;base64,${Buffer.from(report.image).toString('base64')}`;

    return NextResponse.json({ image: base64Image });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal mengambil gambar', error: error.message },
      { status: 500 },
    );
  }
}
