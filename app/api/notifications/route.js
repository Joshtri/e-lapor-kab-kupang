import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let notifications = [];

    if (user.role === 'PELAPOR') {
      // Notifikasi untuk user pelapor
      notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    } else if (user.role === 'OPD') {
      // Notifikasi untuk OPD berdasarkan opdId = user.id (user login sebagai OPD staff)
      notifications = await prisma.notification.findMany({
        where: { opdId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    } else if (user.role === 'ADMIN' || user.role === 'BUPATI') {
      notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Gagal ambil notifikasi:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil notifikasi' },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const { userId, message, link, opdId } = await req.json();

    const newNotification = await prisma.notification.create({
      data: {
        userId,
        message,
        link,
        opdId: Number(opdId),
      },
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menambahkan notifikasi' },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const { id } = await req.json();

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menandai notifikasi' },
      { status: 500 },
    );
  }
}
