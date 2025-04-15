import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';
import bcrypt from 'bcrypt';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST() {
  try {
    const filePath = path.join(process.cwd(), 'public/seed/data_opd_users.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(fileContent);

    const defaultPassword = await bcrypt.hash('kabkupang', 10); // password default semua user OPD

    for (const [i, user] of users.entries()) {
      const { namaLengkap, email, kontak, nip } = user;

      const encryptedNik = encrypt(nip); // sekarang fieldnya nip

      const existing = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { nikNumber: encryptedNik }],
        },
      });

      if (existing) {
        console.log(`⚠️ User ke-${i + 1} (${email}) sudah ada, dilewati.`);
        continue;
      }

      await prisma.user.create({
        data: {
          name: namaLengkap,
          email,
          password: defaultPassword,
          role: 'OPD',
          contactNumber: kontak,
          nikNumber: encryptedNik,
        },
      });

      console.log(`✅ User ke-${i + 1} (${email}) berhasil disimpan.`);
    }

    return NextResponse.json({
      message: 'Sukses menyimpan semua user OPD dari JSON.',
    });
  } catch (err) {
    console.error('Gagal seeding user dari JSON:', err);
    return NextResponse.json({ error: 'Gagal seeding user.' }, { status: 500 });
  }
}
