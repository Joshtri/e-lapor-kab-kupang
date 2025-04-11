import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'OPD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { opdStatus } = await req.json();

    if (!opdStatus) {
      return NextResponse.json(
        { error: 'Status OPD diperlukan.' },
        { status: 400 }
      );
    }

    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: { opdStatus },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('❌ Gagal update opdStatus:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui status OPD.' },
      { status: 500 }
    );
  }
}
