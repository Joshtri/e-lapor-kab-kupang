// /app/api/opd/chat/rooms/[roomId]/messages/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function GET(req, { params }) {
  const { roomId } = params;
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const opd = await prisma.oPD.findUnique({
      where: { staffUserId: userId },
    });

    if (!opd) {
      return NextResponse.json({ error: 'OPD not found' }, { status: 404 });
    }

    // ✅ Tandai semua pesan dari pelapor sebagai sudah dibaca
    await prisma.chatMessage.updateMany({
      where: {
        roomId: parseInt(roomId),
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    const messages = await prisma.chatMessage.findMany({
      where: { roomId: parseInt(roomId) },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });

    const formatted = messages.map((msg) => ({
      ...msg,
      fromMe: msg.senderId === userId,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    'Gagal ambil pesan:', err;
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
