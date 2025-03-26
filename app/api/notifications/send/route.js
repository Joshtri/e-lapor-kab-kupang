// /app/api/notifications/send/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
  try {
    // const authUser = verifyToken(req);
    // if (!authUser || authUser.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { message, link, recipientType, recipients } = body;

    if (!message || !recipientType || !recipients) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }

    let notificationsToCreate = [];

    if (recipientType === 'role') {
      const users = await prisma.user.findMany({
        where: { role: recipients.role },
        select: { id: true },
      });
      notificationsToCreate = users.map((user) => ({
        userId: user.id,
        message,
        link,
      }));
    }

    else if (recipientType === 'specific') {
      notificationsToCreate = recipients.userIds.map((id) => ({
        userId: id,
        message,
        link,
      }));
    }

    else if (recipientType === 'opd') {
      notificationsToCreate = recipients.opdIds.map((opdId) => ({
        opdId,
        message,
        link,
      }));
    }

    // Simpan notifikasi ke DB
    const created = await prisma.notification.createMany({
      data: notificationsToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    console.error('Gagal mengirim notifikasi:', error);
    return NextResponse.json({ error: 'Gagal mengirim notifikasi' }, { status: 500 });
  }
}
