// /app/api/pelapor/bug-reports/[id]/image/route.js

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bugReport = await prisma.bugReport.findUnique({
      where: { id: Number(id) },
      select: {
        attachment: true,
        userId: true,
      },
    });

    if (!bugReport || !bugReport.attachment) {
      return NextResponse.json(
        { message: 'Lampiran tidak ditemukan' },
        { status: 404 },
      );
    }

    // ✅ Proteksi: hanya pelapor dari bug tersebut
    if (user.role !== 'PELAPOR' || bugReport.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const base64Image = `data:image/jpeg;base64,${Buffer.from(bugReport.attachment).toString('base64')}`;

    return NextResponse.json({ image: base64Image });
  } catch (error) {
    console.error('[BUG_REPORT_IMAGE]', error);
    return NextResponse.json(
      { message: 'Gagal mengambil lampiran', error: error.message },
      { status: 500 },
    );
  }
}
