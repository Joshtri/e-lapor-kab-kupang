import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { format, startOfMonth, subMonths, subYears } from 'date-fns';
import { NextResponse } from 'next/server';

// Fungsi bantu untuk warna status
function getStatusColor(status) {
  switch (status) {
    case 'PENDING':
      return '#facc15'; // kuning
    case 'SELESAI':
      return '#4ade80'; // hijau
    case 'DIPROSES':
      return '#3b82f6'; // biru
    case 'DITOLAK':
      return '#f87171'; // merah
    default:
      return '#94a3b8'; // abu-abu
  }
}

export async function GET(req) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || '';
  const range = searchParams.get('range') || '6months';

  if (userId && typeof userId !== 'string') {
    return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
  }

  let startDate = new Date();
  if (range === '6months') {
    startDate = subMonths(startOfMonth(new Date()), 6);
  } else if (range === '1year') {
    startDate = subYears(startOfMonth(new Date()), 1);
  } else {
    return NextResponse.json({ message: 'Invalid range' }, { status: 400 });
  }

  const reports = await prisma.report.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      id: true,
      createdAt: true,
      bupatiStatus: true,
      category: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // === Pie Chart: Distribusi status laporan ===
  const statusCount = {};
  for (const report of reports) {
    const status = report.bupatiStatus || 'LAINNYA';
    statusCount[status] = (statusCount[status] || 0) + 1;
  }

  const statusChart = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value,
    color: getStatusColor(name),
  }));

  // === Area Chart: Tren bulanan laporan ===
  const monthlyMap = new Map();
  for (const report of reports) {
    const month = format(new Date(report.createdAt), 'MMM yyyy');
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
  }

  const monthlyChart = Array.from(monthlyMap.entries()).map(
    ([month, reports]) => ({ month, reports }),
  );

  // === Bar Chart: Jumlah laporan per kategori ===
  const categoryCount = {};
  for (const report of reports) {
    const category = report.category || 'LAINNYA';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  }

  const categoryChart = Object.entries(categoryCount).map(
    ([category, count]) => ({
      category,
      count,
    }),
  );

  return NextResponse.json({
    statusChart,
    monthlyChart,
    categoryChart,
  });
}
