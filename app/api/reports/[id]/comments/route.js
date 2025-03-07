import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST komentar
export async function POST(req, context) {
  const { id } = context.params;
  const { userId, comment } = await req.json();

  if (!userId || !comment) {
    return NextResponse.json(
      { error: "userId dan comment wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        reportId: Number(id),
        userId,
        comment,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Gagal menambahkan komentar:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan komentar." },
      { status: 500 },
    );
  }
}

// GET komentar
export async function GET(req, context) {
  const { id } = context.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { reportId: Number(id) },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Gagal mengambil komentar:", error);
    return NextResponse.json(
      { error: "Gagal mengambil komentar." },
      { status: 500 },
    );
  }
}
