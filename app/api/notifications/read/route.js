import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: 'ID notifikasi diperlukan' },
        { status: 400 },
      );
    }

    // ✅ Update status isRead ke true
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return NextResponse.json(
      { message: 'Notifikasi diperbarui' },
      { status: 200 },
    );
  } catch (error) {
    'Gagal memperbarui notifikasi:', error;
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
}
