import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth'; // ✅ ganti helper auth

export async function POST(req) {
  const user = await getAuthenticatedUser(req); // ✅ pakai req

  if (!user || user.role !== 'OPD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { roomId, content } = await req.json();

  if (!roomId || !content) {
    return NextResponse.json(
      { error: 'roomId dan content wajib diisi' },
      { status: 400 },
    );
  }

  // Opsional: validasi apakah user OPD memang terkait dengan room ini
  // Tapi untuk sekarang kita anggap valid selama role OPD dan roomId valid

  const message = await prisma.chatMessage.create({
    data: {
      roomId,
      senderId: user.id,
      content,
    },
    include: {
      sender: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  // Update waktu terakhir interaksi pada chat room
  await prisma.chatRoom.update({
    where: { id: roomId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({
    ...message,
    fromMe: true, // ✅ client bisa pakai ini untuk styling
  });
}
