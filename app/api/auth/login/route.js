import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { decrypt } from '@/lib/encryption';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email atau NIK dan password wajib diisi.' },
        { status: 400 },
      );
    }

    let user = null;

    // 🔍 Cek apakah input berupa email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (isEmail) {
      // Login via email
      user = await prisma.user.findUnique({ where: { email } });
    } else {
      // Login via NIK → bandingkan hasil dekripsi
      const users = await prisma.user.findMany({
        where: { nikNumber: { not: null } }, // pastikan ada isinya
      });

      user = users.find((u) => {
        try {
          return decrypt(u.nikNumber) === email;
        } catch {
          return false;
        }
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Akun tidak ditemukan.' },
        { status: 404 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Password salah.' }, { status: 401 });
    }

    // 🔐 Buat token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return new NextResponse(
      JSON.stringify({ message: 'Login berhasil', user: safeUser }),
      {
        status: 200,
        headers: { 'Set-Cookie': cookie },
      },
    );
  } catch (error) {
    ('Login Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 },
    );
  }
}
