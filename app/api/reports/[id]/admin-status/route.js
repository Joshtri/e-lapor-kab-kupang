import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const { id } = params;
  const { bupatiStatus, opdStatus } = await req.json();

  if (!bupatiStatus && !opdStatus) {
    return Response.json({ error: 'Minimal satu status harus diisi.' }, { status: 400 });
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: {
        ...(bupatiStatus && { bupatiStatus }),
        ...(opdStatus && { opdStatus }),
      },
    });

    return Response.json(updatedReport);
  } catch (error) {
    console.error('❌ Gagal update status oleh admin:', error);
    return Response.json(
      { error: 'Gagal mengupdate status laporan.' },
      { status: 500 }
    );
  }
}
