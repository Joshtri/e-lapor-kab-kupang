import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ ganti helper auth

export async function POST(req, context) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ pakai req
    if (!user || user.role !== 'BUPATI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roomId = context.params.roomId;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 },
      );
    }

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room || !room.isToBupati) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        roomId,
        content,
        senderId: user.id,
        isRead: false,
      },
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

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    // ('[POST /chat/message]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
