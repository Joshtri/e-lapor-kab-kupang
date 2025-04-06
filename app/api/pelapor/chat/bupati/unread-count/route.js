import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ count: 0 });

    // Hitung pesan dari Bupati yang belum dibaca
    const count = await prisma.chatMessage.count({
      where: {
        room: {
          userId: user.id,
          isToBupati: true,
        },
        isRead: false,
        NOT: { senderId: user.id }, // hanya pesan dari Bupati
      },
    });

    return NextResponse.json({ count });
  } catch (err) {
    return NextResponse.json({ count: 0 });
  }
}
