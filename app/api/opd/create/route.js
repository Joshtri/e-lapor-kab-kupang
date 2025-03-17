import { getSession } from "@/lib/auth"; // Pastikan Anda memiliki middleware auth
import { prisma } from "@/lib/prisma"; // Pastikan path sesuai dengan setup Prisma
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // ✅ Periksa sesi pengguna (hanya admin yang boleh akses)
    const session = await getSession(req);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ Ambil data dari request body
    const { name, email, password } = await req.json();

    // ✅ Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // ✅ Cek apakah email OPD sudah digunakan
    const existingOpd = await prisma.oPD.findUnique({
      where: { email },
    });

    if (existingOpd) {
      return NextResponse.json(
        { error: "Email OPD already exists." },
        { status: 400 }
      );
    }

    // ✅ Hash password sebelum menyimpan ke database
    const hashedPassword = await hash(password, 10);

    // ✅ Buat OPD baru
    const newOpd = await prisma.oPD.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "OPD created successfully", opd: newOpd }, { status: 201 });
  } catch (error) {
    console.error("Error creating OPD:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
