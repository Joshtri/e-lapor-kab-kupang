import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const opdList = await prisma.oPD.findMany({
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reports: {
          select: {
            id: true,
            userId: true,
            title: true,
            description: true,
            location: true,
            category: true,
            subcategory: true,
            priority: true,
            bupatiStatus: true,
            opdStatus: true,
            createdAt: true,
            updatedAt: true,
            assignedAt: true,
            respondedAt: true,
            isReadByBupati: true,
            isReadByOpd: true,
            // image: false  ← you simply omit it
          },
          orderBy: { createdAt: 'desc' }, // if you still need to order the reports
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(opdList);
  } catch (error) {
    'Gagal ambil data OPD:', error;
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
