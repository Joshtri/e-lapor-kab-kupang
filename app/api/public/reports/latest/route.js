import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
  try {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const latestReports = await prisma.report.findMany({
      where: {
        // bupatiStatus: 'SELESAI',
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
      select: {
        id: true,
        title: true,
        category: true,
        subcategory: true,
        description: true,
        createdAt: true,
        bupatiStatus: true,
        opd: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(latestReports);
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to fetch reports' },
      { status: 500 },
    );
  }
}
