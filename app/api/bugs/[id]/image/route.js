import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const bug = await prisma.bugReport.findUnique({
      where: { id: Number(id) },
      select: { attachment: true },
    });

    if (!bug || !bug.attachment) {
      return NextResponse.json(
        { error: 'Lampiran tidak ditemukan' },
        { status: 404 },
      );
    }

    const base64Image = `data:image/jpeg;base64,${Buffer.from(
      bug.attachment,
    ).toString('base64')}`;

    return NextResponse.json({ image: base64Image });
  } catch (error) {
    console.error('[GET /api/bugs/:id/image]', error);
    return NextResponse.json(
      { error: 'Gagal memuat lampiran' },
      { status: 500 },
    );
  }
}
