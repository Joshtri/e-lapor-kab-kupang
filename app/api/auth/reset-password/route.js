import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    console.log('🚀 Reset Password API Called');

    const { token, newPassword } = await req.json();
    console.log('🔑 Received Token:', token);
    console.log('🔒 New Password Input:', newPassword);

    if (!token || !newPassword) {
      console.error('❌ Missing Token or Password');
      return NextResponse.json(
        { error: 'Token dan password baru diperlukan' },
        { status: 400 },
      );
    }

    // 🔍 Cari user berdasarkan reset token di database
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: {
          not: null,
        },
      },
    });

    if (!user) {
      console.error('❌ Token tidak ditemukan dalam database');
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 });
    }

    console.log('✅ User found:', user.email);

    // 🔄 Cek apakah token masih valid
    const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValidToken || new Date(user.resetPasswordExpires) < new Date()) {
      console.error('❌ Token kedaluwarsa atau tidak valid');
      return NextResponse.json(
        { error: 'Token sudah kadaluarsa atau tidak valid' },
        { status: 401 },
      );
    }

    console.log('🔓 Token valid');

    // 🔑 Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('🔒 New Hashed Password:', hashedPassword);

    // 🛠 Update password di database
    await prisma.user.update({
      where: { email: user.email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    console.log('✅ Password updated successfully for:', user.email);

    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('🔥 Server error in reset-password API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server, coba lagi nanti.' },
      { status: 500 },
    );
  }
}
