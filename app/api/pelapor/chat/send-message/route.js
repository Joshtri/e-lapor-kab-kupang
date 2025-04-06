import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    console.log('BODY:', body); // log ini penting
    const { roomId, content } = body;

    if (!roomId || !content)
      return NextResponse.json(
        { error: 'roomId dan content wajib diisi.' },
        { status: 400 },
      );

    // Opsional: validasi apakah user memang punya akses ke room ini
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
