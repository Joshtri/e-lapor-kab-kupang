import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ pakai helper baru

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ fleksibel dari cookie/header

    if (!user || user.role !== 'BUPATI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rooms = await prisma.chatRoom.findMany({
      where: {
        isToBupati: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
