import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PATCH(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportId, opdId } = await req.json();

    if (!reportId || !opdId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await prisma.report.update({
      where: { id: Number(reportId) },
      data: { opdId: Number(opdId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    '❌ Gagal update opdId laporan:', error.message;
    return NextResponse.json(
      { error: 'Gagal mengupdate data.', detail: error.message },
      { status: 500 },
    );
  }
}
