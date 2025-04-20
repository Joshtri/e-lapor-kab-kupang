import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const formatted = notifications.map((notif) => ({
      id: notif.id,
      message: notif.message,
      link: notif.link,
      isRead: notif.isRead,
      createdAt: notif.createdAt,
      user: notif.user
        ? {
            id: notif.user.id,
            name: notif.user.name,
            email: notif.user.email,
            role: notif.user.role,
          }
        : null,
      opdId: notif.opdId,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    '[ERROR] Get Notifications:', error;
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
