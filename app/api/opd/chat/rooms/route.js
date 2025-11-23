import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ helper fleksibel

export async function GET(req) {
  const user = await getAuthenticatedUser(req); // ✅ pakai req

  if (!user || user.role !== 'OPD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Get user with their OPD assignment
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: { opd: true },
  });

  if (!userData?.opd) {
    return NextResponse.json(
      { error: 'OPD profile not found' },
      { status: 404 },
    );
  }

  // ✅ Ambil semua chat room yang ditujukan ke OPD ini
  const rooms = await prisma.chatRoom.findMany({
    where: { opdId: userData.opd.id },
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
