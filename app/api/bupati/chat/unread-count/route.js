import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromCookie();
    if (!user || user.role !== 'BUPATI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hitung pesan belum dibaca dari pelapor ke bupati
    const count = await prisma.chatMessage.count({
      where: {
        isRead: false,
        room: {
          isToBupati: true,
        },
        NOT: {
          senderId: user.id,
        },
      },
    });

    return NextResponse.json({ unreadCount: count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
