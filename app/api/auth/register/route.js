import { encrypt } from '@/lib/encryption';
import { sendWelcomeEmail } from '@/lib/email/sendWelcomeEmail';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { fullName, nikNumber, contactNumber, email, password } =
      await req.json();

    const encryptedNik = encrypt(nikNumber);

    // Cek duplikasi
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nikNumber: encryptedNik }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email atau NIK sudah terdaftar' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        nikNumber: encryptedNik,
        contactNumber,
        email,
        password: hashedPassword,
        role: 'PELAPOR',
      },
    });

    // Kirim email selamat datang
    await sendWelcomeEmail(email, fullName);

    return NextResponse.json(
      {
        message: 'User berhasil didaftarkan!',
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 },
    );
  } catch (error) {
    error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
