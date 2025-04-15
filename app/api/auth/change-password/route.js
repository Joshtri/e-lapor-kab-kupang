import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PATCH(req) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Password lama dan baru wajib diisi.' },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const isValid = await bcrypt.compare(
      currentPassword,
      existingUser.password,
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Password lama tidak cocok.' },
        { status: 401 },
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ message: 'Password berhasil diperbarui.' });
  } catch (err) {
    console.error('Gagal update password:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengubah password.' },
      { status: 500 },
    );
  }
}
