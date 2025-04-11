import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ helper fleksibel

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ pakai req
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const { roomId } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: 'roomId is required' },
        { status: 400 }
      );
    }

    // ✅ Update semua pesan yang belum dibaca dan bukan dari user sendiri
    await prisma.chatMessage.updateMany({
      where: {
        roomId,
        isRead: false,
        NOT: { senderId: user.id },
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /chat/read-messages]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
