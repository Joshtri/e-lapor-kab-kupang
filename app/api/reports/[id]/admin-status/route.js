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

    const { bupatiStatus, opdStatus } = await req.json();

    if (!bupatiStatus && !opdStatus) {
      return NextResponse.json(
        { error: 'Minimal satu status harus diisi.' },
        { status: 400 },
      );
    }

    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: {
        ...(bupatiStatus && { bupatiStatus }),
        ...(opdStatus && { opdStatus }),
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
      await prisma.notification.create({
        data: {
          ...notifData,
          message: `Laporan "${updatedReport.title}" Anda telah diperbarui oleh Bupati. Status menjadi "${bupatiStatus}".`,
        },
      });

      await sendStatusUpdateEmail({
        to: updatedReport.user.email,
        name: updatedReport.user.name,
        title: updatedReport.title,
        status: bupatiStatus,
      });
    }

    if (opdStatus) {
      await prisma.notification.create({
        data: {
          ...notifData,
          message: `Laporan "${updatedReport.title}" Anda telah ditindaklanjuti oleh OPD. Status menjadi "${opdStatus}".`,
        },
      });

      await sendStatusUpdateEmail({
        to: updatedReport.user.email,
        name: updatedReport.user.name,
        title: updatedReport.title,
        status: opdStatus,
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
