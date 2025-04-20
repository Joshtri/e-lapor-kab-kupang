import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const sortBy = searchParams.get('sortBy');

  try {
    switch (type) {
      case 'summary':
        return await handleSummary();
      case 'list':
        return await handleList();
      case 'ranking':
        return await handleRanking(sortBy);
      case 'overdue':
        return await handleOverdue();
      case 'categories':
        return await handleCategories();
      case 'monthlyTrend':
        return await handleMonthlyTrend();
      default:
        return NextResponse.json(
          { message: 'Invalid type parameter' },
          { status: 400 },
        );
    }
  } catch (error) {
    'API Error:', error;
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 },
    );
  }
}

async function handleSummary() {
  const totalOpd = await prisma.oPD.count();
  const totalReports = await prisma.report.count();
  const selesai = await prisma.report.count({
    where: { opdStatus: 'SELESAI' },
  });
  const ditolak = await prisma.report.count({
    where: { opdStatus: 'DITOLAK' },
  });

  const reports = await prisma.report.findMany({
    where: { assignedAt: { not: null }, respondedAt: { not: null } },
    select: { assignedAt: true, respondedAt: true },
  });

  const avgMs =
    reports.reduce((total, r) => {
      return total + (new Date(r.respondedAt) - new Date(r.assignedAt));
    }, 0) / (reports.length || 1);

  const avgDays = (avgMs / (1000 * 60 * 60 * 24)).toFixed(1);

  return NextResponse.json({
    totalOpd,
    totalReports,
    selesai,
    ditolak,
    avgResponseTime: `${avgDays} hari`,
  });
}

async function handleList() {
  const opdList = await prisma.oPD.findMany({
    include: {
      reports: {
        select: {
          id: true,
          opdStatus: true,
          assignedAt: true,
          respondedAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const result = opdList.map((opd) => {
    const total = opd.reports.length;
    const selesai = opd.reports.filter((r) => r.opdStatus === 'SELESAI').length;
    const proses = opd.reports.filter((r) => r.opdStatus === 'PROSES').length;
    const ditolak = opd.reports.filter((r) => r.opdStatus === 'DITOLAK').length;
    const pending = opd.reports.filter((r) => r.opdStatus === 'PENDING').length;

    const responseTimes = opd.reports
      .filter((r) => r.assignedAt && r.respondedAt)
      .map((r) => new Date(r.respondedAt) - new Date(r.assignedAt));
    const avgResponseTime =
      responseTimes.length > 0
        ? `${(responseTimes.reduce((a, b) => a + b) / responseTimes.length / (1000 * 60 * 60 * 24)).toFixed(1)} hari`
        : '-';

    const completionTimes = opd.reports
      .filter((r) => r.assignedAt && r.opdStatus === 'SELESAI')
      .map((r) => new Date(r.updatedAt) - new Date(r.assignedAt));
    const avgCompletionTime =
      completionTimes.length > 0
        ? `${(completionTimes.reduce((a, b) => a + b) / completionTimes.length / (1000 * 60 * 60 * 24)).toFixed(1)} hari`
        : '-';

    const lastResponse = opd.reports.reduce((latest, r) => {
      if (!r.respondedAt) return latest;
      return !latest || new Date(r.respondedAt) > new Date(latest)
        ? r.respondedAt
        : latest;
    }, null);

    return {
      opdId: opd.id,
      name: opd.name,
      totalReports: total,
      selesai,
      proses,
      ditolak,
      pending,
      completionRate: total ? ((selesai / total) * 100).toFixed(1) : '0.0',
      avgResponseTime,
      avgCompletionTime,
      lastResponse,
    };
  });

  return NextResponse.json(result);
}

async function handleRanking(sortBy) {
  const listRes = await handleList();
  const data = await listRes.json();

  const sorted = [...data].sort((a, b) => {
    if (sortBy === 'completionRate') return b.completionRate - a.completionRate;
    if (sortBy === 'avgResponseTime')
      return parseFloat(a.avgResponseTime) - parseFloat(b.avgResponseTime);
    if (sortBy === 'avgCompletionTime')
      return parseFloat(a.avgCompletionTime) - parseFloat(b.avgCompletionTime);
    return 0;
  });

  return NextResponse.json({
    top3: sorted.slice(0, 3),
    bottom3: sorted.slice(-3).reverse(),
  });
}

async function handleOverdue() {
  const now = new Date();
  const all = await prisma.oPD.findMany({
    include: {
      reports: {
        where: {
          opdStatus: { in: ['PENDING', 'PROSES'] },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          opdStatus: true,
        },
      },
    },
  });

  const overdue = all
    .map((opd) => {
      const overdueReports = opd.reports.filter((r) => {
        const diffDays = (now - new Date(r.createdAt)) / (1000 * 60 * 60 * 24);
        return diffDays > 7;
      });
      return overdueReports.length > 0
        ? {
            opdId: opd.id,
            name: opd.name,
            overdueReports: overdueReports.length,
            details: overdueReports,
          }
        : null;
    })
    .filter(Boolean);

  return NextResponse.json(overdue);
}

async function handleCategories() {
  const all = await prisma.oPD.findMany({
    include: {
      reports: {
        select: {
          category: true,
        },
      },
    },
  });

  const result = all.map((opd) => {
    const categoryCount = {};
    opd.reports.forEach((r) => {
      categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCount).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      opdId: opd.id,
      name: opd.name,
      topCategory: topCategory ? topCategory[0] : '-',
      count: topCategory ? topCategory[1] : 0,
    };
  });

  return NextResponse.json(result);
}

async function handleMonthlyTrend() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const reports = await prisma.report.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      opdId: true,
      createdAt: true,
      opd: {
        select: { name: true },
      },
    },
  });

  const data = {};

  reports.forEach((r) => {
    if (!r.opdId || !r.opd) return;
    const month = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;

    if (!data[r.opdId]) {
      data[r.opdId] = { opdId: r.opdId, name: r.opd.name, monthlyData: {} };
    }

    data[r.opdId].monthlyData[month] =
      (data[r.opdId].monthlyData[month] || 0) + 1;
  });

  const formatted = Object.values(data).map((d) => ({
    opdId: d.opdId,
    name: d.name,
    monthlyData: Object.entries(d.monthlyData).map(([month, count]) => ({
      month,
      count,
    })),
  }));

  return NextResponse.json(formatted);
}
