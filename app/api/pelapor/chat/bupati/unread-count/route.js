import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ gunakan nama yang benar

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ kirim `req` ke helper
    if (!user) return NextResponse.json({ count: 0 });

    const count = await prisma.chatMessage.count({
      where: {
        room: {
          userId: user.id,
          isToBupati: true,
        },
        isRead: false,
        NOT: { senderId: user.id },
      },
    });

    return NextResponse.json({ unreadCount: count });
  } catch (err) {
    return NextResponse.json({ count: 0 });
  }
}
