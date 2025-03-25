import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req) {
  const { reportId, opdId } = await req.json();
  if (!reportId || !opdId)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  await prisma.report.update({
    where: { id: reportId },
    data: { opdId },
  });

  return NextResponse.json({ success: true });
}
