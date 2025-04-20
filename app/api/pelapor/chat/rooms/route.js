import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ auth helper

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ pakai req

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Ambil semua room milik pelapor
    const rooms = await prisma.chatRoom.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        opd: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    '[GET /pelapor/chat/rooms]', error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
