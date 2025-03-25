// pages/api/opd/[id].js

import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const opd = await prisma.oPD.findUnique({
      where: { id: Number(id) },
      include: {
        staff: true,
        reports: {
          include: {
            user: true, // pelapor
          },
        },
      },
    });

    if (!opd) {
      return new Response(JSON.stringify({ error: 'OPD tidak ditemukan' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(opd), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Gagal ambil detail OPD:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
