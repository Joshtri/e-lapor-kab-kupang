import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await prisma.report.findUnique({
      where: { id: Number(id) },
      select: {
        image: true,
        userId: true,
        opdId: true,
      },
    });

    if (!report || !report.image) {
      return NextResponse.json(
        { message: 'Gambar tidak ditemukan' },
        { status: 404 },
      );
    }

    // ✅ Proteksi akses: hanya pelapor, OPD terkait, atau Bupati yang boleh akses
    const isAuthorized =
      user.role === 'ADMIN' ||
      user.role === 'BUPATI' ||
      (user.role === 'PELAPOR' && report.userId === user.id) ||
      (user.role === 'OPD' && report.opdId !== null);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const base64Image = `data:image/jpeg;base64,${Buffer.from(report.image).toString('base64')}`;

    return NextResponse.json({ image: base64Image });
  } catch (error) {
    '[GET /reports/:id/image]', error;
    return NextResponse.json(
      { message: 'Gagal mengambil gambar', error: error.message },
      { status: 500 },
    );
  }
}
