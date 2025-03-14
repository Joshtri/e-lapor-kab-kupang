import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 },
      );
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan." },
        { status: 404 },
      );
    }

    // Cek password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Password salah." }, { status: 401 });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Simpan token di cookie
    const cookie = serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Tambahan keamanan
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    });

    // Hanya kirim data penting ke client
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return new NextResponse(
      JSON.stringify({ message: "Login berhasil", user: safeUser }),
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      },
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}