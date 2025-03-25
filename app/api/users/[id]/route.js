import prisma from '@/lib/prisma'; // pastikan path prisma kamu benar

export async function GET(req, { params }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
    });
  }

  try {
    // Ambil user detail
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        opd: true, // jika user ada relasi ke OPD
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Jika role PELAPOR, ambil laporan berdasarkan userId
    let reports = [];
    if (user.role === 'PELAPOR') {
      reports = await prisma.report.findMany({
        where: { userId: user.id },
        include: {
          opd: true, // bisa tambahkan relasi lainnya juga
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return new Response(
      JSON.stringify({
        user,
        reports, // kosong jika bukan pelapor
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error fetching user detail:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
