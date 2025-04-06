// File: /app/api/pelapor/chat/rooms/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = getUserFromCookie();
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rooms = await prisma.chatRoom.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        opd: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
