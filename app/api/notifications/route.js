import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil notifikasi' },
      { status: 500 },
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
