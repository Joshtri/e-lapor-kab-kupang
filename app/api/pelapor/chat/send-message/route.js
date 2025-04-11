import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ GANTI dari getUserFromCookie

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ kirim `req` ke helper
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { roomId, content } = body;

    if (!roomId || !content)
      return NextResponse.json(
        { error: 'roomId dan content wajib diisi.' },
        { status: 400 },
      );

    // Opsional: validasi akses room
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room || room.userId !== user.id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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

    return NextResponse.json({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      fromMe: true,
      sender: message.sender,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
