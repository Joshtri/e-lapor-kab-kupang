import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { getMaskedNik } from '@/utils/mask';
import { decrypt } from '@/lib/encryption';

export async function GET(req) {
  try {
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
        nikNumber: true,
        contactNumber: true,
        createdAt: true,
        updatedAt: true,

        opd: {
          select: {
            id: true,
            name: true,
            alamat: true,
            email: true,
            telp: true,
            website: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cek apakah nikNumber terenkripsi (mengandung ":" sebagai pemisah IV)
    const isEncrypted =
      typeof user.nikNumber === 'string' && user.nikNumber.includes(':');

    // Optional: Jika suatu saat butuh nik dalam bentuk terdekripsi
    let decryptedNik = null;
    try {
      if (isEncrypted) {
        decryptedNik = decrypt(user.nikNumber);
      }
    } catch (e) {
      console.warn('❌ Gagal decrypt nikNumber:', user.nikNumber);
    }

    // Respon yang dikembalikan ke frontend
    const responseData = {
      user: {
        ...user,
        // Tetap kirimkan nikNumber asli (encrypted) untuk keperluan edit form
        nikNumber: user.nikNumber,
        // Kirim versi masked untuk ditampilkan di UI
        nikMasked: user.nikNumber ? getMaskedNik(user.nikNumber) : null,
        // Jika ingin menampilkan hasil dekripsi:
        nikDecrypted: decryptedNik,
      },
    };

    if (user.role === 'OPD') {
      responseData.opd = user.opd;
    }

    return NextResponse.json(responseData);
  } catch (error) {
    '[GET /api/auth/me]', error;
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
