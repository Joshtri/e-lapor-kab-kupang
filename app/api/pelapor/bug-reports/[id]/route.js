import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';


export async function PATCH(req, { params }) {
    const id = parseInt(params.id);
    const { statusProblem, priorityProblem } = await req.json();
  
    try {
      const updated = await prisma.bugReport.update({
        where: { id },
        data: {
          ...(statusProblem && { statusProblem }),
          ...(priorityProblem && { priorityProblem }),
        },
      });
  
      return NextResponse.json(updated);
    } catch (error) {
      console.error('[PATCH BUG]', error);
      return NextResponse.json(
        { error: 'Gagal memperbarui status/prioritas bug' },
        { status: 500 }
      );
    }
  }
  