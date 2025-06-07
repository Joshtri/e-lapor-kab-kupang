import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { transporter } from '@/lib/email/transporter'; // atau path sesuai lokasi transporter kamu
// import { render } from '@react-email/render'; // jika kamu gunakan templating, opsional
import webpush from 'web-push';

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

    if (!opd || opd.staff.role !== 'OPD') {
      return NextResponse.json(
        { error: 'OPD tidak valid atau tidak ditemukan.' },
        { status: 400 },
      );
    }

    let imageBuffer = null;
    if (file && typeof file.arrayBuffer === 'function') {
      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    if (file && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File bukan gambar.' },
        { status: 400 },
      );
    }

    if (file && file.size > 5_000_000) {
      return NextResponse.json(
        { error: 'Ukuran gambar terlalu besar.' },
        { status: 400 },
      );
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


    // 🔔 Kirim Web Push ke OPD (jika ada)
    const opdSub = await prisma.pushSubscription.findUnique({
      where: { userId: opd.staff.id },
    });
    if (opdSub) {
      await webpush.sendNotification(
        opdSub,
        JSON.stringify({
          title: 'Laporan Baru Masuk',
          body: `Laporan: ${newReport.title}`,
          url: `https://${req.headers.get('host')}/opd/laporan-warga/${newReport.id}`,
          icon: '/icon.png',
        }),
      );
    }

    // 🔔 Kirim Web Push ke ADMIN + BUPATI
    for (const admin of adminBupati) {
      const sub = await prisma.pushSubscription.findUnique({
        where: { userId: admin.id },
      });
      if (sub) {
        await webpush.sendNotification(
          sub,
          JSON.stringify({
            title: 'Laporan Baru',
            body: `Laporan "${newReport.title}" telah dikirim.`,
            url:
              admin.role === 'ADMIN'
                ? `https://${req.headers.get('host')}/adm/report-warga/${newReport.id}`
                : `https://${req.headers.get('host')}/bupati-portal/laporan-warga/${newReport.id}`,
            icon: '/icon.png',
          }),
        );
      }
    }

    // 🔔 Kirim Web Push ke PELAPOR
    const pelaporSub = await prisma.pushSubscription.findUnique({
      where: { userId },
    });
    if (pelaporSub) {
      await webpush.sendNotification(
        pelaporSub,
        JSON.stringify({
          title: 'Laporan Anda Terkirim!',
          body: `Laporan "${newReport.title}" berhasil dikirim.`,
          url: `https://${req.headers.get('host')}/pelapor/log-laporan`,
          icon: '/icon.png',
        }),
      );
    }

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
      opdId: opd.staff.id,
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

    // ✅ Kirim email ke semua BUPATI
    const bupatiEmails = adminBupati.filter(
      (u) => u.role === 'BUPATI' && u.email,
    );

    for (const bupati of bupatiEmails) {
      try {
        // Get host from request headers to build dynamic URL
        const host = req.headers.get('host');
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const reportLink = `${protocol}://${host}/bupati-portal/laporan-warga/${newReport.id}`;

        await transporter.sendMail({
          from: `"LAPOR KK BUPATI" <${process.env.EMAIL_USER}>`,
          to: bupati.email,
          subject: '📬 Laporan Baru Telah Dikirim',
          html: `
        <p>Yth. ${bupati.name || 'Bupati'},</p>
        <p>Sebuah laporan baru telah dikirim oleh warga.</p>
        <p><strong>Judul:</strong> ${newReport.title}</p>
        <p><strong>Kategori:</strong> ${newReport.category}</p>
        <p><strong>Prioritas:</strong> ${newReport.priority}</p>
        <p>
          Silakan tinjau laporan ini melalui portal Bupati:<br/>
          <a href="${reportLink}">
            Lihat Laporan
          </a>
        </p>
        <br/>
        <p>Hormat kami,<br/>Sistem Lapor Warga</p>
          `,
        });
      } catch (emailErr) {
        // (`❌ Gagal kirim email ke ${bupati.email}:`, emailErr);
      }
    }

    return NextResponse.json(
      { message: 'Laporan berhasil dikirim.', report: newReport },
      { status: 201 },
    );
  } catch (error) {
    // ('❌ Gagal membuat laporan:', error);
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
