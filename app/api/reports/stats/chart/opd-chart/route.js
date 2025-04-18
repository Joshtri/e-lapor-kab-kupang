import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { format, subMonths, differenceInDays } from 'date-fns';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'OPD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const opd = await prisma.oPD.findUnique({
      where: { staffUserId: user.id },
    });

    if (!opd) {
      return NextResponse.json(
        { error: 'OPD tidak ditemukan' },
        { status: 404 },
      );
    }

    const reports = await prisma.report.findMany({
      where: { opdId: opd.id },
    });

    // 1️⃣ Laporan per bulan (12 bulan terakhir)
    const monthMap = {};
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const key = format(date, 'MMM yyyy');
      monthMap[key] = 0;
    }

    reports.forEach((r) => {
      const key = format(new Date(r.createdAt), 'MMM yyyy');
      if (monthMap[key] !== undefined) monthMap[key]++;
    });

    const laporanPerBulan = Object.entries(monthMap).map(([bulan, jumlah]) => ({
      bulan,
      jumlah,
    }));

    // 2️⃣ Distribusi Kategori (dinamis)
    const kategoriMap = {};
    reports.forEach((r) => {
      const kategori = r.category || 'LAINNYA';
      if (!kategoriMap[kategori]) kategoriMap[kategori] = 0;
      kategoriMap[kategori]++;
    });

    const kategoriDistribusi = Object.entries(kategoriMap).map(
      ([kategori, jumlah]) => ({ kategori, jumlah }),
    );

    // 3️⃣ Rata-rata waktu penanganan (assignedAt → respondedAt)
    const selesai = reports.filter(
      (r) => r.opdStatus === 'SELESAI' && r.assignedAt && r.respondedAt,
    );
    
    let avgHandlingTime = null;
    if (selesai.length > 0) {
      const totalDays = selesai.reduce((sum, r) => {
        const diff = (new Date(r.respondedAt) - new Date(r.assignedAt)) / (1000 * 60 * 60 * 24);
        return sum + diff;
      }, 0);
      avgHandlingTime = parseFloat((totalDays / selesai.length).toFixed(1));
    }
    

    // 4️⃣ Distribusi Prioritas
    const prioritasMap = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    reports.forEach((r) => {
      if (prioritasMap[r.priority] !== undefined) {
        prioritasMap[r.priority]++;
      }
    });

    const distribusiPrioritas = prioritasMap;

    // 5️⃣ Laporan Tertunda > 7 Hari (status masih PENDING dan lebih dari 7 hari)
    const now = new Date();
    const laporanTertundaLebih7Hari = reports.filter((r) => {
      return (
        r.opdStatus === 'PENDING' &&
        differenceInDays(now, new Date(r.createdAt)) > 7
      );
    }).length;

    return NextResponse.json({
      laporanPerBulan,
      kategoriDistribusi,
      avgHandlingTime,
      distribusiPrioritas,
      laporanTertundaLebih7Hari,
    });
  } catch (err) {
    console.error('❌ Gagal generate statistik OPD:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
