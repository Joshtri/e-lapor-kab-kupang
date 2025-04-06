// /app/api/opd/chat/rooms/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'OPD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Cari OPD profile berdasarkan user
  const opd = await prisma.oPD.findUnique({
    where: { staffUserId: user.id },
  });

  if (!opd) {
    return NextResponse.json({ error: 'OPD profile not found' }, { status: 404 });
  }

  // Ambil semua chat room yang ditujukan ke OPD tersebut
  const rooms = await prisma.chatRoom.findMany({
    where: { opdId: opd.id },
    include: {
      user: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(rooms);
}
