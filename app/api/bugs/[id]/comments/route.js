import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get all comments for a bug report
export async function GET(_request, params, id) {
  try {
    const bugId = parseInt(params.id);

    const comments = await prisma.bugComment.findMany({
      where: { bugReportId: bugId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' }, // Chronological order
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('[BUG_COMMENTS_GET]', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data komentar' },
      { status: 500 },
    );
  }
}

// Add a new comment to a bug report
export async function POST(request, params, id) {
  try {
    const bugId = parseInt(params.id);
    const { userId, message } = await request.json();

    // Validate input
    if (!userId || !message) {
      return NextResponse.json(
        { error: 'User ID dan pesan tidak boleh kosong' },
        { status: 400 },
      );
    }

    // Create new comment
    const newComment = await prisma.bugComment.create({
      data: {
        bugReportId: bugId,
        userId,
        message,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // Update the bug's updatedAt timestamp
    await prisma.bugReport.update({
      where: { id: bugId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('[BUG_COMMENTS_POST]', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan komentar' },
      { status: 500 },
    );
  }
}
