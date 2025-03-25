import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const token = cookies().get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "OPD") {
      return NextResponse.json({ error: "Forbidden. Hanya OPD." }, { status: 403 });
    }

    const userId = decoded.id;

    // Cek profil OPD milik user ini
    const opdProfile = await prisma.oPD.findUnique({
      where: { userId },
    });

    if (!opdProfile) {
      return NextResponse.json({ error: "Profil OPD tidak ditemukan" }, { status: 404 });
    }

    const reports = await prisma.report.findMany({
      where: {
        opdId: opdProfile.id, // hanya ambil laporan yg ditujukan ke OPD ini
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Gagal mengambil laporan OPD:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
