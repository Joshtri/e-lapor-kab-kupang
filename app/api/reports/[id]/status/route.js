import  prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  const { id } = params; // reportId
  const { status } = await req.json();

  if (!status) {
    return Response.json({ error: "Status wajib diisi." }, { status: 400 });
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: { status },
    });

    return Response.json(updatedReport);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal mengupdate status laporan." }, { status: 500 });
  }
}
