import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';
import { sendResetPasswordEmail } from '@/lib/email/sendResetPasswordEmail';

// Konfigurasi Nodemailer dengan debug logging
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // SMTP Host
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true, // ✅ Log SMTP activity
  debug: true, // ✅ Debug SMTP connection
});

export async function POST(req) {
  try {
    console.log('🚀 Forgot Password API Called');

    const { email } = await req.json();
    console.log('📩 Email received:', email);

    if (!email || typeof email !== 'string') {
      console.error('❌ Invalid email input:', email);
      return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 });
    }

    // 🔍 Cek apakah email ada di database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error('❌ Email not found in database:', email);
      return NextResponse.json(
        { error: 'Email tidak ditemukan' },
        { status: 404 },
      );
    }

    console.log('✅ User found:', user.email);

    // 🔑 Generate reset token
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('🔑 Generated Reset Token:', resetToken);

    // 🔐 Hash token sebelum disimpan
    const hashedToken = await bcrypt.hash(resetToken, 10);
    console.log('🔒 Hashed Reset Token:', hashedToken);

    // 🛠 Simpan token di database
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 3600000),
      }, // 1 jam
    });

    console.log('💾 Reset Token saved to DB for user:', email);

    // 🔗 Buat reset link
    const headersList = await headers();
    const host = headersList.get('host');

    const protocol = host.includes('localhost') ? 'http' : 'https';
    const resetLink = `${protocol}://${host}/auth/reset-password?token=${resetToken}`;

    console.log('🔗 Generated Reset Link:', resetLink);

    // 📤 Kirim email reset password
    const mailOptions = {
      from: `"Lapor KK Bupati" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Password',
      html: `
                <p>Halo ${user.name},</p>
                <p>Klik link berikut untuk mereset password Anda:</p>
                <a href="${resetLink}" target="_blank">${resetLink}</a>
                <p>Link ini hanya berlaku selama 1 jam.</p>
            `,
    };

    await sendResetPasswordEmail(mailOptions);
    console.log('📩 Email sent to:', email);

    return NextResponse.json({
      message: 'Link reset password telah dikirim ke email.',
    });
  } catch (error) {
    console.error('🔥 Server error in forget-password API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server, coba lagi nanti.' },
      { status: 500 },
    );
  }
}
