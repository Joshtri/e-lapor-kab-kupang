import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only ADMIN and BUPATI can view staff
  if (user.role !== 'ADMIN' && user.role !== 'BUPATI') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: opdId } = params;

  try {
    // Fetch staff yang terkait dengan OPD ini
    const staff = await prisma.user.findMany({
      where: {
        opdId: opdId,
        role: 'OPD', // Pastikan hanya ambil user dengan role OPD
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    console.error('Error fetching OPD staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OPD staff' },
      { status: 500 }
    );
  }
}
