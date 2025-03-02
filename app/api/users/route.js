import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// 📌 Create User
export async function POST(req) {
  try {
    const { name, nikNumber, contactNumber, email, password, role } =
      await req.json();

    // Validasi basic
    if (
      !name ||
      !nikNumber ||
      !contactNumber ||
      !email ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (nikNumber.length !== 16) {
      return NextResponse.json(
        { error: "NIK harus tepat 16 digit." },
        { status: 400 }
      );
    }

    if (contactNumber.length > 15) {
      return NextResponse.json(
        { error: "Nomor kontak maksimal 15 digit." },
        { status: 400 }
      );
    }

    // Cek jika email atau NIK sudah ada
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nikNumber }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email atau NIK sudah terdaftar." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUser = await prisma.user.create({
      data: {
        name,
        nikNumber,
        contactNumber,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat user:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat user." },
      { status: 500 }
    );
  }
}

// 📌 GET (optional, kalau mau list semua user)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        nikNumber: true,
        contactNumber: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data users." },
      { status: 500 }
    );
  }
}
