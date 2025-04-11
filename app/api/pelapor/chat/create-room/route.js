import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ ganti helper

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ pakai req

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { opdId, isToBupati } = await req.json();

    // ✅ Cek apakah room sudah ada antara pelapor & OPD atau pelapor & Bupati
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        userId: user.id,
        opdId: opdId || null,
        isToBupati: isToBupati === true,
      },
    });

    if (existingRoom) {
      return NextResponse.json(existingRoom); // ✅ Room sudah ada
    }

    // ✅ Buat room baru
    const newRoom = await prisma.chatRoom.create({
      data: {
        userId: user.id,
        opdId: opdId || null,
        isToBupati: isToBupati === true,
      },
    });

    return NextResponse.json(newRoom);
  } catch (error) {
    console.error('[POST /pelapor/chat/create-room]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
