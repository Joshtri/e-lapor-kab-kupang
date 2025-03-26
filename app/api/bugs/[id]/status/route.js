import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, params, id) {
  try {
    const bugId = parseInt(params.id);
    const { statusProblem } = await request.json();

    // Validate input
    if (!statusProblem) {
      return NextResponse.json(
        { error: 'Status tidak boleh kosong' },
        { status: 400 },
      );
    }

    // Update bug status
    const updatedBug = await prisma.bugReport.update({
      where: { id: bugId },
      data: {
        statusProblem,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedBug);
  } catch (error) {
    console.error('[BUG_STATUS_UPDATE]', error);
    return NextResponse.json(
      { error: 'Gagal mengubah status bug' },
      { status: 500 },
    );
  }
}
