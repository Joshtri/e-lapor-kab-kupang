import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  try {
    // Authenticate user (only admin should access this)
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Validate dates
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Format dates for query (add time to make it inclusive)
    const startDateTime = new Date(`${startDate}T00:00:00.000Z`);
    const endDateTime = new Date(`${endDate}T23:59:59.999Z`);

    // Fetch reports within date range
    const reports = await prisma.report.findMany({
      where: {
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        opd: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching journal reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}