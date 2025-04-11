import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const { id } = params; // reportId
  const { bupatiStatus } = await req.json();

  if (!bupatiStatus) {
    return NextResponse.json({ error: 'Status wajib diisi.' }, { status: 400 });
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: { bupatiStatus },
      include: {
        user: true,
      },
    });

    const notifToPelapor = {
      userId: updatedReport.user.id,
      message: `Status laporan "${updatedReport.title}" Anda telah diperbarui menjadi "${bupatiStatus}".`,
      link: '/pelapor/log-laporan',
      createdAt: new Date(),
    };

    await prisma.notification.create({
      data: notifToPelapor,
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Gagal mengupdate status laporan.' },
      { status: 500 },
    );
  }
}
