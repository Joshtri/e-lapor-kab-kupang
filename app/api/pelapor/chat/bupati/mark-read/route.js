import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ success: false });

    const { roomId } = await req.json();

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
  } catch {
    return NextResponse.json({ success: false });
  }
}
