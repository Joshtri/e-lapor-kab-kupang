import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { transporter } from '@/lib/email/transporter'; // atau path sesuai lokasi transporter kamu
import { convertFileToBuffer, validateImageFile } from '@/utils/common';
import { render } from '@react-email/render';
import NotificationEmail from '@/components/common/NotificationEmail'; // pastikan path sesuai

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ betul
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const reports = await prisma.report.findMany({
      where: userId ? { userId: Number(userId) } : {},
      include: {
        user: { select: { id: true, name: true, email: true } },
        opd: { select: { id: true, name: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = reports.map((r) => {
      const { image, ...rest } = r;
      return { ...rest, image: null };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    '❌ Gagal ambil daftar laporan:', error;
    return NextResponse.json(
      { error: 'Gagal mengambil daftar laporan.' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || !['PELAPOR', 'ADMIN', 'BUPATI'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const userId = parseInt(form.get('userId'));
    const title = form.get('title');
    const category = form.get('category');
    const priority = form.get('priority');
    const subcategory = form.get('subcategory') || '-';
    const location = form.get('location') || '-';
    const description = form.get('description');
    const opdId = parseInt(form.get('opdId'));
    const file = form.get('image');
    const imageBuffer = await convertFileToBuffer(file);

    if (!userId || !title || !category || !priority || !description || !opdId) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 },
      );
    }

    const opd = await prisma.oPD.findUnique({
      where: { id: opdId },
      include: { staff: { select: { id: true, role: true } } },
    });

    if (!opd || opd.staff?.role !== 'OPD') {
      return NextResponse.json(
        { error: 'OPD tidak valid atau tidak ditemukan.' },
        { status: 400 },
      );
    }

    const { valid, error } = validateImageFile(file);
    if (!valid) {
      return NextResponse.json({ error }, { status: 400 });
    }

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
        image: imageBuffer,
        bupatiStatus: 'PENDING',
        opdStatus: 'PENDING',
        assignedAt: new Date(),
      },
    });

    const adminBupati = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'BUPATI'] } },
      select: { id: true, role: true, email: true, name: true },
    });

    const notifAdminBupati = adminBupati.map((u) => ({
      userId: u.id,
      message: `Laporan baru: "${newReport.title}" telah dibuat.`,
      link:
        u.role === 'ADMIN'
          ? `/adm/report-warga/${newReport.id}`
          : `/bupati-portal/laporan-warga/${newReport.id}`,
      createdAt: new Date(),
    }));

    const notifOPD = {
      userId: opd.staff.id, // Changed from opdId to userId to match schema
      message: `Anda menerima laporan baru: "${newReport.title}"`,
      link: `/opd/laporan-warga/${newReport.id}`,
      createdAt: new Date(),
    };

    await prisma.notification.createMany({
      data: [...notifAdminBupati, notifOPD],
    });

    await prisma.notification.create({
      data: {
        userId,
        message: `Laporan Anda dengan judul "${newReport.title}" telah berhasil dikirim.`,
        link: '/pelapor/log-laporan',
        createdAt: new Date(),
      },
    });

    // Send emails to BUPATI
    const bupatiEmails = adminBupati.filter(
      (u) => u.role === 'BUPATI' && u.email,
    );

    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const reportLink = `${protocol}://${host}/bupati-portal/laporan-warga/${newReport.id}`;

    for (const bupati of bupatiEmails) {
      try {
        // Ensure render is awaited to resolve the Promise
        const emailHtml = await render(
          NotificationEmail({
            previewText: `Laporan Baru: ${newReport.title}`,
            greeting: `Yth. ${bupati.name || 'Bupati'},`,
            intro: 'Sebuah laporan baru telah dikirim oleh warga.',
            details: [
              { label: 'Judul', value: newReport.title },
              { label: 'Kategori', value: newReport.category },
              { label: 'Prioritas', value: newReport.priority },
            ],
            ctaLabel: 'Lihat Laporan',
            ctaLink: reportLink,
            closing: 'Hormat kami,\nSistem Lapor Warga',
          }),
        );

        await transporter.sendMail({
          from: `"Lapor Kaka Bupati" <${process.env.EMAIL_USER}>`,
          to: bupati.email,
          subject: '📬 Laporan Baru Telah Dikirim',
          html: emailHtml, // Now a string
        });
      } catch (emailErr) {
        console.error(`Failed to send email to ${bupati.email}:`, emailErr);
      }
    }

    return NextResponse.json(
      { message: 'Laporan berhasil dikirim.', report: newReport },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create report:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server.', detail: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'BUPATI')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

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

    return NextResponse.json(updatedReport);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal memperbarui status laporan' },
      { status: 500 },
    );
  }
}
