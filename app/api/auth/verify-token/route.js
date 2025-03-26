import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 400 },
      );
    }

    // 1️⃣ Decode token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Token tidak valid atau telah kedaluwarsa' },
        { status: 401 },
      );
    }

    // 2️⃣ Cek token di database
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { resetPasswordToken: true, resetPasswordExpires: true },
    });

    if (!user || !user.resetPasswordToken) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 });
    }

    // 3️⃣ Bandingkan token dengan hash di database
    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValid || user.resetPasswordExpires < new Date()) {
      return NextResponse.json(
        { error: 'Token sudah kadaluarsa' },
        { status: 401 },
      );
    }

    return NextResponse.json({ message: 'Token valid' });
  } catch (error) {
    console.error('🔥 Error verifying reset token:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
}
