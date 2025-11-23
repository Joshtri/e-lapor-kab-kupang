import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const authCookies = cookies();
  const token = authCookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const { id: opdId } = params;
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const overdue = searchParams.get('overdue') === 'true';

    // Build where clause
    const where = {
      opdId: opdId,
    };

    if (category) {
      where.category = category;
    }

    if (overdue) {
      // Filter untuk pengaduan yang belum diselesaikan dan sudah lebih dari 7 hari
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      where.AND = [
        {
          bupatiStatus: { not: 'SELESAI' },
        },
        {
          createdAt: { lt: sevenDaysAgo },
        },
      ];
    }

    // Fetch reports
    const reports = await prisma.report.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        opd: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching OPD reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
