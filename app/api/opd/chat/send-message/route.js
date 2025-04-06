// /app/api/opd/chat/send-message/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'OPD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { roomId, content } = await req.json();

  const message = await prisma.chatMessage.create({
    data: {
      roomId,
      senderId: user.id,
      content,
    },
    include: {
      sender: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  await prisma.chatRoom.update({
    where: { id: roomId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({
    ...message,
    fromMe: true,
  });
}
