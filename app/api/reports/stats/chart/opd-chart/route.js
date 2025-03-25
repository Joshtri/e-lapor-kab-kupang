// /app/api/reports/stats/opd-summary/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { startOfMonth, format } from 'date-fns';

export async function GET() {
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    // Ambil OPD berdasarkan user login
    const opd = await prisma.oPD.findUnique({
      where: { staffUserId: decoded.id },
    });

    if (!opd) {
      return NextResponse.json({ error: 'OPD tidak ditemukan' }, { status: 404 });
    }

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
    for (const kategori of ['INFRASTRUKTUR', 'PELAYANAN', 'SOSIAL', 'KEAMANAN', 'LAINNYA']) {
      kategoriDistribusi[kategori] = 0;
    }
    reports.forEach((r) => {
      kategoriDistribusi[r.category]++;
    });
    const kategoriPie = Object.entries(kategoriDistribusi).map(([kategori, jumlah]) => ({ kategori, jumlah }));

    // 🕒 Rata-rata waktu penanganan
    const selesai = reports.filter(r => r.opdStatus === 'SELESAI' && r.assignedAt && r.respondedAt);
    let avgHandlingTime = 0;
    if (selesai.length > 0) {
      const totalDays = selesai.reduce((sum, r) => {
        const diff = (new Date(r.respondedAt) - new Date(r.assignedAt)) / (1000 * 60 * 60 * 24);
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
    console.error('Gagal generate statistik OPD:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
