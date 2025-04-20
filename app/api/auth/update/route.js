import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { encrypt } from '@/lib/encryption';

export async function PATCH(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { nikNumber: true },
    });
    
    let encryptedNik = undefined;
    
    if (body.nikNumber) {
      // Jika NIK yang dikirim berbeda dari yang sudah terenkripsi, berarti user mengubahnya
      const isNikChanged = body.nikNumber !== existingUser?.nikNumber;
    
      if (isNikChanged) {
        encryptedNik = encrypt(body.nikNumber);
      }
    }
    

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
        email: body.email,
        contactNumber: body.contactNumber,
        nikNumber: encryptedNik ?? undefined, // kalau undefined, tidak diubah
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('[UPDATE_PROFILE]', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui profil.' },
      { status: 500 },
    );
  }
}
