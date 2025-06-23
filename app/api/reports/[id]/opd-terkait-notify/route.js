import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PATCH(req, { params }) {
  const { id } = params;
  const { opdId, previousOpdId, previousOpdName, newOpdName } =
    await req.json();

  if (!opdId) {
    return NextResponse.json({ error: 'OPD ID wajib diisi.' }, { status: 400 });
  }

  try {
    // Get authenticated user for logging
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validasi apakah OPD ada
    const opd = await prisma.oPD.findUnique({
      where: { id: Number(opdId) },
    });

    if (!opd) {
      return NextResponse.json(
        { error: 'OPD tidak ditemukan.' },
        { status: 404 },
      );
    }

    // Get current report to log previous OPD if not provided
    let logPreviousOpdName = previousOpdName;
    if (!logPreviousOpdName && previousOpdId) {
      const prevOpd = await prisma.oPD.findUnique({
        where: { id: Number(previousOpdId) },
        select: { name: true },
      });
      if (prevOpd) {
        logPreviousOpdName = prevOpd.name;
      }
    }

    // Update laporan
    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: {
        opdId: Number(opdId),
        isReadByOpd: false,
        assignedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        opd: {
          select: {
            id: true,
            name: true,
            staff: {
              select: {
                id: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true, // Include name for better notification message
          },
        },
      },
    });

    // Create log entry for the OPD change using the details field in the Log model
    const logMessage = logPreviousOpdName
      ? `OPD terkait diubah dari "${logPreviousOpdName}" menjadi "${opd.name}"`
      : `OPD terkait ditetapkan: "${opd.name}"`;

    await prisma.log.create({
      data: {
        reportId: Number(id),
        userId: user.id,
        action: 'STATUS_CHANGED', // Using existing action enum
        details: logMessage, // Using the details field that exists in your schema
        timestamp: new Date(),
      },
    });

    // Create notification for OPD staff
    if (updatedReport.opd?.staff?.id) {
      await prisma.notification.create({
        data: {
          userId: updatedReport.opd.staff.id,
          message: `Laporan baru ditugaskan ke OPD Anda: "${updatedReport.title || 'Laporan #' + id}"`,
          link: `/opd/laporan/${id}`,
          createdAt: new Date(),
        },
      });
    }

    // Notify report creator if applicable
    if (updatedReport.user?.id) {
      await prisma.notification.create({
        data: {
          userId: updatedReport.user.id,
          message: `OPD terkait untuk laporan Anda "${updatedReport.title}" telah diperbarui menjadi ${opd.name}.`,
          link: `/pelapor/log-laporan/${id}`,
          createdAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      message: 'OPD berhasil diperbarui.',
      report: updatedReport,
      log: {
        message: logMessage,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('[UPDATE_REPORT_OPD_ERROR]', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate laporan.' },
      { status: 500 },
    );
  }
}
