import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { transporter } from '@/lib/email/transporter';
import { convertFileToBuffer, validateImageFile } from '@/utils/common';
import { render } from '@react-email/render';
import NotificationEmail from '@/components/common/NotificationEmail';
import { sendNotificationToUser } from '@/lib/webPushServer';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req); // ✅ betul
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(50, parseInt(searchParams.get('limit')) || 10); // Default 10, max 50
    const skip = (page - 1) * limit;

    // ✅ Optimize: Exclude image blob, paginate, minimal includes
    const reports = await prisma.report.findMany({
      where: userId ? { userId } : {},
      select: {
        id: true,
        userId: true,
        title: true,
        category: true,
        subcategory: true,
        priority: true,
        location: true,
        description: true,
        bupatiStatus: true,
        opdStatus: true,
        isReadByBupati: true,
        isReadByOpd: true,
        createdAt: true,
        updatedAt: true,
        opdId: true,
        user: { select: { id: true, name: true, email: true } },
        opd: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // ✅ Get total count for pagination
    const total = await prisma.report.count({
      where: userId ? { userId } : {},
    });

    return NextResponse.json({
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Gagal ambil daftar laporan:', error);
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
    const userId = form.get('userId');
    const title = form.get('title');
    const category = form.get('category');
    const priority = form.get('priority');
    const subcategory = form.get('subcategory') || '-';
    const location = form.get('location') || '-';
    const description = form.get('description');
    const opdId = form.get('opdId');
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
      include: {
        staff: {
          where: { role: 'OPD' },
          select: { id: true, role: true },
          take: 1
        }
      },
    });

    if (!opd) {
      return NextResponse.json(
        { error: 'OPD tidak valid atau tidak ditemukan.' },
        { status: 400 },
      );
    }

    // ✅ Validasi ada staff OPD (karena staff adalah array)
    if (!opd.staff || opd.staff.length === 0) {
      return NextResponse.json(
        { error: 'OPD tidak memiliki staff yang valid.' },
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
          ? `/adm/kelola-pengaduan/${newReport.id}`
          : `/bupati-portal/kelola-pengaduan/${newReport.id}`,
      createdAt: new Date(),
    }));

    // ✅ Buat notifikasi untuk semua staff OPD
    const notifOPD = opd.staff.map((staffMember) => ({
      userId: staffMember.id,
      message: `Anda menerima laporan baru: "${newReport.title}"`,
      link: `/opd/laporan-warga/${newReport.id}`,
      createdAt: new Date(),
    }));

    await prisma.notification.createMany({
      data: [...notifAdminBupati, ...notifOPD],
    });

    await prisma.notification.create({
      data: {
        userId,
        message: `Laporan Anda dengan judul "${newReport.title}" telah berhasil dikirim.`,
        link: '/pelapor/riwayat-pengaduan',
        createdAt: new Date(),
      },
    });

    // ✅ Send PUSH NOTIFICATIONS to BUPATI & ADMIN
    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const reportLink = `${protocol}://${host}/bupati-portal/kelola-pengaduan/${newReport.id}`;

    // Send push notifications to all Bupati and Admin in parallel
    const pushNotificationPromises = adminBupati.map((user) => {
      const link = user.role === 'ADMIN'
        ? `${protocol}://${host}/adm/kelola-pengaduan/${newReport.id}`
        : reportLink;

      return sendNotificationToUser(user.id, {
        title: '📬 Laporan Baru',
        body: `Laporan baru: "${newReport.title}" - Prioritas: ${newReport.priority}`,
        icon: '/icons/icon-192.png',
        data: {
          url: link,
          reportId: newReport.id,
        },
      }).catch((err) => {
        console.error(`Failed to send push to user ${user.id} (${user.name}):`, err);
      });
    });

    // Send push notifications to OPD staff
    const opdPushPromises = opd.staff.map((staffMember) => {
      return sendNotificationToUser(staffMember.id, {
        title: '📬 Laporan Baru untuk OPD',
        body: `Anda menerima laporan baru: "${newReport.title}"`,
        icon: '/icons/icon-192.png',
        data: {
          url: `${protocol}://${host}/opd/laporan-warga/${newReport.id}`,
          reportId: newReport.id,
        },
      }).catch((err) => {
        console.error(`Failed to send push to OPD staff ${staffMember.id}:`, err);
      });
    });

    // Non-blocking: send all push notifications in background
    Promise.all([...pushNotificationPromises, ...opdPushPromises]).catch((err) => {
      console.error('Push notification error:', err);
    });


    // ✅ Send emails to BUPATI (optimized)
    const bupatiEmails = adminBupati.filter(
      (u) => u.role === 'BUPATI' && u.email,
    );

    if (bupatiEmails.length > 0) {

      // ✅ Render email HTML ONCE, not for each bupati
      const emailHtml = await render(
        NotificationEmail({
          previewText: `Laporan Baru: ${newReport.title}`,
          greeting: 'Yth. Bupati,',
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

      // ✅ Send emails in parallel (not sequential)
      const emailPromises = bupatiEmails.map((bupati) =>
        transporter.sendMail({
          from: `"Lapor Kaka Bupati" <${process.env.EMAIL_USER}>`,
          to: bupati.email,
          subject: '📬 Laporan Baru Telah Dikirim',
          html: emailHtml,
        }).catch((err) => {
          console.error(`Failed to send email to ${bupati.email}:`, err);
        }),
      );

      // Non-blocking: send emails in background
      Promise.all(emailPromises).catch((err) =>
        console.error('Email sending error:', err),
      );
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
