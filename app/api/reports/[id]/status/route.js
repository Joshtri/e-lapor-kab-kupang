import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendStatusUpdateEmail } from '@/lib/email/sendStatusUpdateEmail';

export async function PATCH(req, { params }) {
  const { id } = params;
  const { bupatiStatus } = await req.json();

  if (!bupatiStatus) {
    return NextResponse.json({ error: 'Status wajib diisi.' }, { status: 400 });
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: { bupatiStatus },
      include: { user: true },
    });

    // 📬 Notifikasi in-app
    await prisma.notification.create({
      data: {
        userId: updatedReport.user.id,
        message: `Status laporan "${updatedReport.title}" Anda telah diperbarui menjadi "${bupatiStatus}".`,
        link: '/pelapor/log-laporan',
        createdAt: new Date(),
      },
    });

    // 📧 Notifikasi via email
    await sendStatusUpdateEmail({
      to: updatedReport.user.email,
      name: updatedReport.user.name,
      title: updatedReport.title,
      status: bupatiStatus,
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('❌ Error updating report status:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate status laporan.' },
      { status: 500 },
    );
  }
}
