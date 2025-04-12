import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { format } from 'date-fns';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'OPD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ambil data OPD berdasarkan user login
    const opd = await prisma.oPD.findUnique({
      where: { staffUserId: user.id },
    });

    if (!opd) {
      return NextResponse.json(
        { error: 'OPD tidak ditemukan' },
        { status: 404 },
      );
    }

    // Ambil semua laporan berdasarkan opdId
    const reports = await prisma.report.findMany({
      where: { opdId: opd.id },
    });

    // 📊 Laporan per bulan (12 bulan terakhir)
    const monthMap = {};
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = format(date, 'MMM yyyy');
      monthMap[key] = 0;
    }

    reports.forEach((r) => {
      const key = format(new Date(r.createdAt), 'MMM yyyy');
      if (monthMap[key] !== undefined) monthMap[key]++;
    });

    const laporanPerBulan = Object.entries(monthMap)
      .reverse()
      .map(([bulan, jumlah]) => ({ bulan, jumlah }));

    // 🥧 Distribusi Kategori
    const kategoriDistribusi = {};
    const allKategori = [
      'INFRASTRUKTUR',
      'PELAYANAN',
      'SOSIAL',
      'KEAMANAN',
      'LAINNYA',
    ];

    for (const kategori of allKategori) {
      kategoriDistribusi[kategori] = 0;
    }

    reports.forEach((r) => {
      if (kategoriDistribusi[r.category] !== undefined) {
        kategoriDistribusi[r.category]++;
      }
    });

    const kategoriPie = Object.entries(kategoriDistribusi).map(
      ([kategori, jumlah]) => ({
        kategori,
        jumlah,
      }),
    );

    // ⏱️ Rata-rata waktu penanganan laporan
    const selesai = reports.filter(
      (r) => r.opdStatus === 'SELESAI' && r.assignedAt && r.respondedAt,
    );

    let avgHandlingTime = 0;
    if (selesai.length > 0) {
      const totalDays = selesai.reduce((sum, r) => {
        const diff =
          (new Date(r.respondedAt) - new Date(r.assignedAt)) /
          (1000 * 60 * 60 * 24);
        return sum + diff;
      }, 0);
      avgHandlingTime = parseFloat((totalDays / selesai.length).toFixed(1));
    }

    return NextResponse.json({
      laporanPerBulan,
      kategoriDistribusi: kategoriPie,
      avgHandlingTime,
    });
  } catch (err) {
    console.error('❌ Gagal generate statistik OPD:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
