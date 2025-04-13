import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'PELAPOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comments = await prisma.bugComment.findMany({
      where: { bugReportId: Number(id) },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comments);
  } catch (err) {
    console.error('[GET BUG COMMENTS]', err);
    return NextResponse.json(
      { error: 'Gagal memuat komentar' },
      { status: 500 },
    );
  }
}

export async function POST(req, { params }) {
  const { id } = params;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'PELAPOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Komentar tidak boleh kosong' },
        { status: 400 },
      );
    }

    const newComment = await prisma.bugComment.create({
      data: {
        bugReportId: Number(id),
        message,
        userId: user.id,
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newComment);
  } catch (err) {
    console.error('[POST BUG COMMENT]', err);
    return NextResponse.json(
      { error: 'Gagal mengirim komentar' },
      { status: 500 },
    );
  }
}
