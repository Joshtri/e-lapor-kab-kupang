import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const user = await getAuthenticatedUser(req);
  if (!user || user.role !== 'BUPATI') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reportId = Number(params.id);
  if (isNaN(reportId)) {
    return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
  }

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { isReadByBupati: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    '❌ Gagal update isReadByBupati:', error;
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
