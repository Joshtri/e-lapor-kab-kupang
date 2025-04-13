import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Opsional: auth check
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hapus notifikasi berdasarkan ID
    const deleted = await prisma.notification.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { success: true, message: 'Notifikasi berhasil dihapus', deleted },
      { status: 200 },
    );
  } catch (error) {
    console.error('[DELETE /api/notifications/:id]', error);
    return NextResponse.json(
      { error: 'Gagal menghapus notifikasi' },
      { status: 500 },
    );
  }
}
