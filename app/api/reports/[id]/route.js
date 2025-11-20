import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || !['ADMIN', 'BUPATI', 'OPD', 'PELAPOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const report = await prisma.report.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
        opd: {
          select: {
            id: true,
            name: true,
            email: true,
            telp: true,
            alamat: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { message: 'Laporan tidak ditemukan.' },
        { status: 404 },
      );
    }

    // ✅ Jika role OPD, pastikan dia hanya bisa melihat laporan miliknya
    // if (user.role === 'OPD' && report.opdId !== user.opdId) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const base64Image = report.image
      ? `data:image/jpeg;base64,${Buffer.from(report.image).toString('base64')}`
      : null;

    return NextResponse.json({
      id: report.id,
      title: report.title,
      priority: report.priority,
      description: report.description,
      kategori: report.category,
      subkategori: report.subcategory,
      pelapor: report.user?.name || 'Tidak diketahui',
      user: report.user,
      opd: report.opd || null,
      bupatiStatus: report.bupatiStatus,
      opdStatus: report.opdStatus,
      createdAt: report.createdAt,
      opdUpdatedAt: report.respondedAt || null,
      bupatiUpdatedAt: report.updatedAt || null,
      opdResponse: report.opdResponse || null,
      bupatiResponse: report.bupatiResponse || null,
      image: base64Image,
    });
  } catch (error) {
    '❌ Gagal ambil detail laporan:', error;
    return NextResponse.json(
      { message: 'Gagal mengambil data laporan.', error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || !['ADMIN', 'BUPATI', 'OPD'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const updateData = await req.json();

    const report = await prisma.report.findUnique({
      where: { id: Number(id) },
      select: { opdId: true },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Laporan tidak ditemukan.' },
        { status: 404 },
      );
    }

    // ✅ Jika OPD, hanya bisa update laporan yang ditujukan padanya
    if (user.role === 'OPD' && report.opdId !== user.opdId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await prisma.report.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
