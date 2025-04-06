// ✅ File: /app/api/opd/chat/unread-count/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'OPD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Temukan OPD profil berdasarkan user
  const opd = await prisma.oPD.findUnique({
    where: { staffUserId: user.id },
  });

  if (!opd) {
    return NextResponse.json({ error: 'OPD not found' }, { status: 404 });
  }

  // Ambil semua room yang ditujukan ke OPD ini
  const rooms = await prisma.chatRoom.findMany({
    where: { opdId: opd.id },
    select: { id: true },
  });

  const roomIds = rooms.map((r) => r.id);

  // Hitung semua pesan yang belum dibaca dan bukan dari OPD
  const unreadCount = await prisma.chatMessage.count({
    where: {
      roomId: { in: roomIds },
      isRead: false,
      sender: {
        role: 'PELAPOR',
      },
    },
  });

  return NextResponse.json({ unreadCount });
}
