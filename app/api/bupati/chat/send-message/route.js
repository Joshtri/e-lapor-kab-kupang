import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ ganti ke helper fleksibel

// GET: Ambil pesan di room tertentu (khusus Bupati)
export async function GET(req, context) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'BUPATI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roomId = Number(context.params.roomId);

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      select: { isToBupati: true },
    });

    if (!room || !room.isToBupati) {
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
      fromMe: msg.senderId === user.id,
      sender: msg.sender,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Kirim pesan ke room (bisa dari Bupati atau pelapor)
export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, content } = await req.json();

    if (!roomId || !content) {
      return NextResponse.json(
        { error: 'roomId and content required' },
        { status: 400 },
      );
    }

    const room = await prisma.chatRoom.findUnique({
      where: { id: Number(roomId) },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Chat room not found' },
        { status: 404 },
      );
    }

    // Validasi role: pelapor hanya boleh mengirim ke room miliknya
    if (user.role === 'PELAPOR' && room.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Bupati hanya boleh mengirim ke room yang isToBupati
    if (user.role === 'BUPATI' && !room.isToBupati) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId: Number(roomId),
        content,
        senderId: user.id,
        isRead: false,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    '[SEND MESSAGE ERROR]', error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
