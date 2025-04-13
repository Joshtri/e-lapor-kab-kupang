// /api/bupati/laporan/unread-count
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const user = await getAuthenticatedUser(req);
  if (!user || user.role !== 'BUPATI') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const count = await prisma.report.count({
    where: {
      isReadByBupati: false,
    },
  });

  return NextResponse.json({ unreadCount: count });
}
