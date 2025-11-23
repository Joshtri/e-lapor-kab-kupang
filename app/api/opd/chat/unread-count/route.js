import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ pakai helper auth baru

export async function GET(req) {
  const user = await getAuthenticatedUser(req); // ✅ pakai req

  if (!user || user.role !== 'OPD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Get user with their OPD
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: { opd: true },
  });

  if (!userData?.opd) {
    return NextResponse.json({ error: 'OPD not found' }, { status: 404 });
  }

  // ✅ Ambil semua room yang ditujukan ke OPD ini
  const rooms = await prisma.chatRoom.findMany({
    where: { opdId: userData.opd.id },
    select: { id: true },
  });

  const roomIds = rooms.map((r) => r.id);

  if (roomIds.length === 0) {
    return NextResponse.json({ unreadCount: 0 });
  }

  // ✅ Hitung pesan yang belum dibaca dan bukan dari OPD (dari pelapor)
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
