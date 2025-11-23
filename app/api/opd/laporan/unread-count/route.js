// /api/opd/laporan/unread-count
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const user = await getAuthenticatedUser(req);

  if (!user || user.role !== 'OPD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user with their OPD
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: { opd: true },
  });

  if (!userData?.opd) {
    return NextResponse.json({ error: 'OPD tidak ditemukan' }, { status: 404 });
  }

  const count = await prisma.report.count({
    where: {
      opdId: userData.opd.id,
      isReadByOpd: false,
    },
  });

  return NextResponse.json({ unreadCount: count });
}
