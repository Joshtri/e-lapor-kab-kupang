import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

export async function GET() {
  try {
    const allReports = await prisma.report.findMany({
      select: {
        category: true,
        createdAt: true,
        bupatiStatus: true,
      },
    });

    // Kategori - Pie Chart
    const pieCounts = {};
    let total = 0;
    for (const r of allReports) {
      if (r.bupatiStatus === 'SELESAI') {
        const cat = r.category || 'LAINNYA';
        pieCounts[cat] = (pieCounts[cat] || 0) + 1;
        total++;
      }
    }

    const pie = Object.entries(pieCounts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
      count,
    }));

    // Statistik Bulanan - Bar Chart
    const barMap = {};

    for (const r of allReports) {
      const month = format(new Date(r.createdAt), 'MMM');
      if (!barMap[month]) {
        barMap[month] = { LaporanMasuk: 0, LaporanSelesai: 0 };
      }
      barMap[month].LaporanMasuk += 1;
      if (r.bupatiStatus === 'SELESAI') {
        barMap[month].LaporanSelesai += 1;
      }
    }

    const bar = Object.entries(barMap).map(([name, stat]) => ({
      name,
      ...stat,
    }));

    return NextResponse.json({ pie, bar });
  } catch (error) {
    '[API ERROR]', error;
    return NextResponse.json(
      { error: 'Failed to fetch visualization data' },
      { status: 500 },
    );
  }
}
