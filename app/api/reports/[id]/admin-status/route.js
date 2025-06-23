import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { sendStatusUpdateEmail } from '@/lib/email/sendStatusUpdateEmail';

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user || !['ADMIN', 'BUPATI', 'OPD'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bupatiStatus, opdStatus, bupatiReason, opdReason } =
      await req.json();

    if (!bupatiStatus && !opdStatus) {
      return NextResponse.json(
        { error: 'Minimal satu status harus diisi.' },
        { status: 400 },
      );
    }

    // Validasi alasan penolakan
    if (bupatiStatus === 'DITOLAK' && !bupatiReason) {
      return NextResponse.json(
        { error: 'Alasan penolakan oleh Bupati harus diisi.' },
        { status: 400 },
      );
    }

    if (opdStatus === 'DITOLAK' && !opdReason) {
      return NextResponse.json(
        { error: 'Alasan penolakan oleh OPD harus diisi.' },
        { status: 400 },
      );
    }

    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: {
        ...(bupatiStatus && { bupatiStatus }),
        ...(opdStatus && { opdStatus }),
        ...(bupatiReason !== undefined && { bupatiReason }),
        ...(opdReason !== undefined && { opdReason }),
      },
      include: { user: true }, // penting untuk notifikasi/email
    });

    const notifData = {
      userId: updatedReport.user.id,
      link: '/pelapor/log-laporan',
      createdAt: new Date(),
    };

    // Kirim notifikasi + email sesuai role
    if (bupatiStatus) {
      let statusMessage = `Laporan "${updatedReport.title}" Anda telah diperbarui oleh Bupati. Status menjadi "${bupatiStatus}".`;

      // Tambahkan alasan jika status DITOLAK
      if (bupatiStatus === 'DITOLAK' && bupatiReason) {
        statusMessage += ` Alasan: "${bupatiReason}"`;
      }

      await prisma.notification.create({
        data: {
          ...notifData,
          message: statusMessage,
        },
      });

      await sendStatusUpdateEmail({
        to: updatedReport.user.email,
        name: updatedReport.user.name,
        title: updatedReport.title,
        status: bupatiStatus,
        reason: bupatiStatus === 'DITOLAK' ? bupatiReason : null,
      });
    }

    if (opdStatus) {
      let statusMessage = `Laporan "${updatedReport.title}" Anda telah ditindaklanjuti oleh OPD. Status menjadi "${opdStatus}".`;

      // Tambahkan alasan jika status DITOLAK
      if (opdStatus === 'DITOLAK' && opdReason) {
        statusMessage += ` Alasan: "${opdReason}"`;
      }

      await prisma.notification.create({
        data: {
          ...notifData,
          message: statusMessage,
        },
      });

      await sendStatusUpdateEmail({
        to: updatedReport.user.email,
        name: updatedReport.user.name,
        title: updatedReport.title,
        status: opdStatus,
        reason: opdStatus === 'DITOLAK' ? opdReason : null,
      });
    }

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('❌ Gagal update status oleh admin/OPD/Bupati:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate status laporan.' },
      { status: 500 },
    );
  }
}
