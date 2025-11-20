import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { sendStatusUpdateEmail } from '@/lib/email/sendStatusUpdateEmail';

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
        { status: 400 },
      );
    }

    // ✅ Update report + ambil relasi user
    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: { opdStatus },
      include: {
        user: true,
      },
    });

    // ✅ Simpan notifikasi untuk pelapor
    await prisma.notification.create({
      data: {
        userId: updatedReport.user.id,
        message: `Laporan "${updatedReport.title}" Anda telah ditindaklanjuti oleh OPD. Status diperbarui menjadi "${opdStatus}".`,
        link: '/pelapor/riwayat-pengaduan',
        createdAt: new Date(),
      },
    });

    // ✅ Kirim email ke pelapor
    await sendStatusUpdateEmail({
      to: updatedReport.user.email,
      name: updatedReport.user.name,
      title: updatedReport.title,
      status: opdStatus,
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    '❌ Gagal update opdStatus:', error;
    return NextResponse.json(
      { error: 'Gagal memperbarui status OPD.' },
      { status: 500 },
    );
  }
}
