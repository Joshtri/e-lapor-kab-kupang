// File: /app/api/pelapor/chat/room/[roomId]/messages/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ GANTI helper auth

export async function GET(req, context) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ pakai `req`
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roomId = Number(context.params.roomId);

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      select: { userId: true },
    });

    if (!room || (user.role === 'PELAPOR' && room.userId !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    const result = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      fromMe: msg.sender.id === user.id, // ✅ lebih akurat
      sender: msg.sender,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
