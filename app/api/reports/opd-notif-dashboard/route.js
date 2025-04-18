import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'OPD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cari opdId berdasarkan staffUserId (user.id)
    const opd = await prisma.oPD.findUnique({
      where: { staffUserId: user.id },
    });

    if (!opd) {
      return NextResponse.json(
        { error: 'OPD tidak ditemukan untuk user ini' },
        { status: 404 },
      );
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const reports = await prisma.report.findMany({
      where: {
        opdId: opd.id,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        subcategory: true,
        priority: true,
        bupatiStatus: true,
        opdStatus: true,
        createdAt: true,
        updatedAt: true,
        isReadByBupati: true,
        isReadByOpd: true,
        user: { select: { id: true, name: true } },
        opd: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('[GET_REPORTS_OPD_NOTIF_DASHBOARD]', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data notifikasi laporan untuk OPD.' },
      { status: 500 },
    );
  }
}
