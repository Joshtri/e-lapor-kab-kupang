import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    // Hapus token dengan mengatur cookie kadaluarsa
    const cookie = serialize("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Kadaluarsa segera
      path: "/",
    });

    return new NextResponse(JSON.stringify({ message: "Logout berhasil" }), {
      status: 200,
      headers: { "Set-Cookie": cookie },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat logout" },
      { status: 500 },
    );
  }
}
