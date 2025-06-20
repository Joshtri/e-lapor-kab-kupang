import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { sendResetPasswordEmail } from '@/lib/email/sendResetPasswordEmail';

export async function POST(req) {
  try {
    ('🚀 Forgot Password API Called');

    const { email } = await req.json();
    '📩 Email received:', email;

    if (!email || typeof email !== 'string') {
      '❌ Invalid email input:', email;
      return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 });
    }

    // 🔍 Cek apakah email ada di database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      '❌ Email not found in database:', email;
      return NextResponse.json(
        { error: 'Email tidak ditemukan' },
        { status: 404 },
      );
    }

    '✅ User found:', user.email;

    // 🔑 Generate reset token
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    '🔑 Generated Reset Token:', resetToken;

    // 🔐 Hash token sebelum disimpan
    const hashedToken = await bcrypt.hash(resetToken, 10);
    '🔒 Hashed Reset Token:', hashedToken;

    // 🛠 Simpan token di database
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 3600000),
      }, // 1 jam
    });

    '💾 Reset Token saved to DB for user:', email;

    // 🔗 Buat reset link
    const headersList = await headers();
    const host = headersList.get('host');

    const protocol = host.includes('localhost') ? 'http' : 'https';
    const resetLink = `${protocol}://${host}/auth/reset-password?token=${resetToken}`;

    '🔗 Generated Reset Link:', resetLink;

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      resetLink,
    });
    '📩 Email sent to:', email;

    return NextResponse.json({
      message: 'Link reset password telah dikirim ke email.',
    });
  } catch (error) {
    '🔥 Server error in forget-password API:', error;
    return NextResponse.json(
      { error: 'Terjadi kesalahan server, coba lagi nanti.' },
      { status: 500 },
    );
  }
}
