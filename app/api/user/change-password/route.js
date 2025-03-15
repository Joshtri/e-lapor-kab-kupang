import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function PATCH(req) {
  const authCookies = cookies();
  const token = authCookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized - Token missing" }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    const { currentPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json({ error: "Password lama salah!" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password berhasil diperbarui!" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Gagal mengubah password", error: error.message },
      { status: 500 }
    );
  }
}
