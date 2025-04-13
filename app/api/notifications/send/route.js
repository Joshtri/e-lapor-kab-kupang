// /app/api/notifications/send/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { verifyToken } from '@/lib/auth'; // opsional jika ingin proteksi admin

export async function POST(req) {
  try {
    // Opsi verifikasi JWT jika ingin membatasi hanya ADMIN:
    // const authUser = await verifyToken(req);
    // if (!authUser || authUser.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { message, recipientType, recipients } = body;

    // Validasi input dasar
    if (!message || !recipientType || !recipients) {
      return NextResponse.json(
        { error: 'Data tidak lengkap.' },
        { status: 400 },
      );
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
      }));
    } else if (recipientType === 'specific') {
      notificationsToCreate = recipients.userIds.map((id) => ({
        userId: id,
        message,
      }));
    } else if (recipientType === 'opd') {
      notificationsToCreate = recipients.opdIds.map((opdId) => ({
        opdId,
        message,
      }));
    }

    if (notificationsToCreate.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada target notifikasi.' },
        { status: 400 },
      );
    }

    const created = await prisma.notification.createMany({
      data: notificationsToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    console.error('[SEND_NOTIFICATION_ERROR]', error);
    return NextResponse.json(
      { error: 'Gagal mengirim notifikasi' },
      { status: 500 },
    );
  }
}
