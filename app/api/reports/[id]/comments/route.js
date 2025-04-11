import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

// POST komentar — Hanya user login yang bisa komen
export async function POST(req, context) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;
    const { comment } = await req.json();

    if (!comment) {
      return NextResponse.json(
        { error: 'Komentar tidak boleh kosong.' },
        { status: 400 },
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        reportId: Number(id),
        userId: user.id, // ✅ pakai user ID dari token
        comment,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('❌ Gagal menambahkan komentar:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan komentar.' },
      { status: 500 },
    );
  }
}

// GET komentar — Optional: public access
export async function GET(req, context) {
  const { id } = context.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { reportId: Number(id) },
      include: {
        user: {
          select: {
            name: true,
            role: true,
            opd: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('❌ Gagal mengambil komentar:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil komentar.' },
      { status: 500 },
    );
  }
}
