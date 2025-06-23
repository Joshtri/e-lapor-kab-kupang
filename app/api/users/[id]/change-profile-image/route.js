import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PATCH(req, { params }) {
    const authUser = await getAuthenticatedUser(req);
    const userId = parseInt(params.id);

    if (!authUser || authUser.id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isNaN(userId)) {
        return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('image');

        if (!file || file.size === 0) {
            return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        await prisma.user.update({
            where: { id: userId },
            data: { avatarImage: buffer },
        });

        return NextResponse.json({ message: 'Foto profil berhasil diperbarui' });
    } catch (error) {
        console.error('❌ Upload error:', error);
        return NextResponse.json({ error: 'Gagal mengunggah foto' }, { status: 500 });
    }
}
