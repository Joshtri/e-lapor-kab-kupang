import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { fullName, nikNumber, contactNumber, email, password } = await req.json();

    // Periksa apakah email atau nikNumber sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nikNumber }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email atau NIK sudah terdaftar" }, { status: 400 });
    }

    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru di database
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        nikNumber,
        contactNumber,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "User berhasil didaftarkan!", user: { id: newUser.id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
