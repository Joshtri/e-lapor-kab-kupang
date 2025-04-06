import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 📌 Ambil Semua Pengaduan
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const reports = await prisma.report.findMany({
      where: userId ? { userId: Number(userId) } : {},
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        opd: {
          select: {
            id: true,
            name: true, // ✅ Nama instansi OPD
          },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // ⛔ Hapus ini karena tidak digunakan:
    // const data = await req.json();

    const body = await req.json();

    const userId = parseInt(body.userId);
    const title = body.title;
    const category = body.category;
    const priority = body.priority;
    const subcategory = body.subcategory || '-'; // kalau belum dipakai
    const location = body.location || '-'; // kalau belum dipakai
    const description = body.description;
    const opdId = parseInt(body.opdId);

    // ✅ Validasi input
    if (
      !userId ||
      !title ||
      !category ||
      !subcategory ||
      !priority ||
      !location ||
      !description ||
      !opdId
    ) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 },
      );
    }

    // ✅ Validasi OPD tujuan
    const opd = await prisma.oPD.findUnique({
      where: { id: opdId },
      include: {
        staff: {
          select: { id: true, role: true },
        },
      },
    });

    if (!opd || opd.staff.role !== 'OPD') {
      return NextResponse.json(
        { error: 'OPD yang dituju tidak valid atau tidak ditemukan.' },
        { status: 400 },
      );
    }

    // ⏳ Jika nanti upload file ke storage, lakukan di sini
    // for (const file of files) {
    //   console.log(file.name, file.type);
    //   const buffer = await file.arrayBuffer();
    //   const fileData = Buffer.from(buffer);
    //   // Upload ke Cloudinary, Supabase, dsb
    // }

    // ✅ Simpan laporan baru
    const newReport = await prisma.report.create({
      data: {
        userId,
        title,
        category,
        subcategory,
        priority,
        description,
        location,
        opdId,
        bupatiStatus: 'PENDING',
        opdStatus: 'PENDING',
        assignedAt: new Date(),
      },
    });

    // ✅ Notifikasi untuk ADMIN & BUPATI
    const adminBupati = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'BUPATI'] } },
      select: { id: true, role: true },
    });

    const notifAdminBupati = adminBupati.map((user) => {
      const basePath =
        user.role === 'ADMIN'
          ? '/adm/report-warga'
          : '/bupati-portal/laporan-warga';

      return {
        userId: user.id,
        message: `Laporan baru: "${newReport.title}" telah dibuat.`,
        link: `${basePath}/${newReport.id}`,
        createdAt: new Date(),
      };
    });

    // ✅ Notifikasi untuk OPD tujuan
    const notifOPD = {
      userId: opd.staff.id,
      message: `Anda menerima laporan baru: "${newReport.title}"`,
      link: `/opd/laporan-warga/${newReport.id}`,
      createdAt: new Date(),
    };

    // ✅ Simpan notifikasi
    await prisma.notification.createMany({
      data: [...notifAdminBupati, notifOPD],
    });

    return NextResponse.json(
      { message: 'Laporan berhasil dikirim.', report: newReport },
      { status: 201 },
    );
  } catch (error) {
    console.error('❌ Error creating report:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.', detail: error.message },
      { status: 500 },
    );
  }
}
// 📌 Memperbarui Status Laporan (Hanya untuk Bupati)
export async function PUT(req) {
  try {
    const { id, bupatiStatus } = await req.json();

    if (!['PENDING', 'PROSES', 'SELESAI'].includes(bupatiStatus)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 },
      );
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { bupatiStatus },
    });

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal memperbarui status laporan' },
      { status: 500 },
    );
  }
}
