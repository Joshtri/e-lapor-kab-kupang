import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user || !['ADMIN', 'BUPATI', 'OPD'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bupatiStatus, opdStatus } = await req.json();

    if (!bupatiStatus && !opdStatus) {
      return NextResponse.json(
        { error: 'Minimal satu status harus diisi.' },
        { status: 400 }
      );
    }

    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: {
        ...(bupatiStatus && { bupatiStatus }),
        ...(opdStatus && { opdStatus }),
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('❌ Gagal update status oleh admin:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate status laporan.' },
      { status: 500 }
    );
  }
}
