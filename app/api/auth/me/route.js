import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';


export async function GET() {
  // Await the cookies function call
  const authCookies = await cookies();
  const token = authCookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - Token missing' },
      { status: 401 },
    );
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 },
    );
  }
}