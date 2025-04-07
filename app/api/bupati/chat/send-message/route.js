// File: /app/api/bupati/chat/room/[roomId]/messages/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(req, context) {
  try {
    const user = await getUserFromCookie();
    if (!user || user.role !== 'BUPATI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roomId = Number(context.params.roomId);

    // Pastikan bupati bisa akses room ini (chat dari pelapor ke bupati)
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
      fromMe: msg.senderId === user.id, // ✅ Ini akan jadi false jika bukan dari bupati
      sender: msg.sender,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, content } = await req.json();

    if (!roomId || !content) {
      return NextResponse.json({ error: 'roomId and content required' }, { status: 400 });
    }

    const room = await prisma.chatRoom.findUnique({
      where: { id: Number(roomId) },
    });

    if (!room) {
      return NextResponse.json({ error: 'Chat room not found' }, { status: 404 });
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
    console.error('[SEND MESSAGE ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}