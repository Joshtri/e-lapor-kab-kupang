import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { getMaskedNik } from '@/utils/mask';

export async function GET(req) {
  const decoded = await getAuthenticatedUser(req);

  if (!decoded) {
    return NextResponse.json(
      { error: 'Unauthorized - Token invalid or missing' },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      nikNumber: true, // masih terenkripsi
      contactNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      ...user,
      nikNumber: user.nikNumber ? getMaskedNik(user.nikNumber) : null, // masking nik
    },
  });
}
