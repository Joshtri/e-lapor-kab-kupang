import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { sendCommentEmailNotify } from '@/lib/email/sendCommentEmailNotify';

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

    // 🔧 Buat komentar
    const newComment = await prisma.comment.create({
      data: {
        reportId: id,
        userId: user.id,
        comment,
      },
      include: {
        report: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
    });

    // 🔔 Buat notifikasi ke pemilik laporan (kecuali yang komen adalah dia sendiri)
    if (newComment.report.userId !== user.id) {
      // 🔔 Notifikasi ke pemilik laporan
      await prisma.notification.create({
        data: {
          userId: newComment.report.userId,
          message: `Ada komentar baru pada laporan "${newComment.report.title}".`,
          link: null,
          createdAt: new Date(),
        },
      });

      // 📩 Kirim email notifikasi komentar
      const targetUser = await prisma.user.findUnique({
        where: { id: newComment.report.userId },
        select: { name: true, email: true },
      });

      if (targetUser?.email) {
        await sendCommentEmailNotify({
          to: targetUser.email,
          name: targetUser.name,
          reportTitle: newComment.report.title,
          commentText: comment,
        });
      }
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    '❌ Gagal menambahkan komentar:', error;
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
      where: { reportId: id },
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
    '❌ Gagal mengambil komentar:', error;
    return NextResponse.json(
      { error: 'Gagal mengambil komentar.' },
      { status: 500 },
    );
  }
}
