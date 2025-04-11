import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ ganti import helper

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ pakai req
    if (!user || user.role !== 'BUPATI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId wajib dikirim' },
        { status: 400 },
      );
    }

    await prisma.chatMessage.updateMany({
      where: {
        roomId,
        isRead: false,
        NOT: { senderId: user.id }, // ✅ hanya tandai pesan dari pelapor
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
