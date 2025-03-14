import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { headers } from "next/headers"; // ✅ Import headers

export async function POST(req) {
  try {
    const { email } = await req.json();

    console.log("🔍 Received email:", email); // Debug log

    // 1️⃣ Cek apakah email ada di database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error("❌ Email not found in database:", email);
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 404 });
    }

    // 2️⃣ Generate reset token
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("🔑 Generated Reset Token:", resetToken); // Debug log

    // 3️⃣ Simpan token di database
    await prisma.user.update({
      where: { email },
      data: { resetPasswordToken: resetToken },
    });

    // 4️⃣ Buat reset link yang fleksibel sesuai dengan lingkungan (local/production)
    const host = headers().get("host"); // 🖥 Dapatkan host secara dinamis
    const protocol = host.includes("localhost") ? "http" : "https"; // 🛜 Sesuaikan dengan env
    const resetLink = `${protocol}://${host}/reset-password?token=${resetToken}`; // 🌍 Link yang fleksibel

    // 5️⃣ Kirim email dengan link reset password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `<p>Klik link berikut untuk reset password: <a href="${resetLink}">${resetLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent to:", email); // Debug log

    return NextResponse.json({ message: "Link reset password telah dikirim ke email." });

  } catch (error) {
    console.error("🔥 Server error in forget-password API:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server, coba lagi nanti." },
      { status: 500 }
    );
  }
}
