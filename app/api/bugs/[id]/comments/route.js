import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // Pastikan path sesuai

// GET /api/bugs/:id/comments
export async function GET(req, { params }) {
  try {
    const bugId = params.id;

    if (!bugId || typeof bugId !== 'string') {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const comments = await prisma.bugComment.findMany({
      where: { bugReportId: bugId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    // ('[BUG_COMMENTS_GET]', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data komentar' },
      { status: 500 },
    );
  }
}

// POST /api/bugs/:id/comments
export async function POST(req, { params }) {
  try {
    const bugId = params.id;
    const { message } = await req.json();

    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' },
        { status: 400 },
      );
    }

    const newComment = await prisma.bugComment.create({
      data: {
        bugReportId: bugId,
        userId: user.id,
        message,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    await prisma.bugReport.update({
      where: { id: bugId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    // ('[BUG_COMMENTS_POST]', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan komentar' },
      { status: 500 },
    );
  }
}
