// /api/opd/laporan/unread-count
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const user = await getAuthenticatedUser(req);

  if (!user || user.role !== 'OPD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const opd = await prisma.oPD.findUnique({
    where: { staffUserId: user.id },
  });

  if (!opd) {
    return NextResponse.json({ error: 'OPD tidak ditemukan' }, { status: 404 });
  }

  const count = await prisma.report.count({
    where: {
      opdId: opd.id,
      isReadByOpd: false,
    },
  });

  return NextResponse.json({ unreadCount: count });
}
