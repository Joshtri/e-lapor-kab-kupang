import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ helper baru

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ pakai req
    if (!user || user.role !== 'BUPATI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hitung jumlah pesan belum dibaca yang dikirim pelapor ke Bupati
    const count = await prisma.chatMessage.count({
      where: {
        isRead: false,
        room: {
          isToBupati: true,
        },
        NOT: {
          senderId: user.id, // ✅ hanya pesan dari pelapor
        },
      },
    });

    return NextResponse.json({ unreadCount: count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
