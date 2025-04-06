// File: /app/api/pelapor/chat/create-room/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { opdId, isToBupati } = body;

    // ❗ Cek apakah room sudah ada
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        userId: user.id,
        opdId: opdId || null,
        isToBupati: isToBupati === true,
      },
    });

    if (existingRoom) return NextResponse.json(existingRoom);

    const room = await prisma.chatRoom.create({
      data: {
        userId: user.id,
        opdId: opdId || null,
        isToBupati: isToBupati === true,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
