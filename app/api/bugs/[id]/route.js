import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const bug = await prisma.bugReport.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!bug) {
      return NextResponse.json(
        { error: 'Laporan bug tidak ditemukan' },
        { status: 404 },
      );
    }

    let responseData = { ...bug, hasAttachment: !!bug.attachment };

    // Add base64 encoded image if attachment exists
    if (bug.attachment) {
      responseData.image = `data:image/jpeg;base64,${Buffer.from(bug.attachment).toString('base64')}`;
    }

    return NextResponse.json(responseData);
  } catch (error) {
    // ('[GET /api/bugs/:id]', error);
    return NextResponse.json(
      { error: 'Gagal memuat detail laporan bug.' },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  const id = parseInt(params.id);
  const { statusProblem, priorityProblem } = await req.json();

  try {
    const updated = await prisma.bugReport.update({
      where: { id },
      data: {
        ...(statusProblem && { statusProblem }),
        ...(priorityProblem && { priorityProblem }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    '[PATCH BUG]', error;
    return NextResponse.json(
      { error: 'Gagal memperbarui status/prioritas bug' },
      { status: 500 },
    );
  }
}
