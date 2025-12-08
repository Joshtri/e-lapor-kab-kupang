const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addLainnyaCategory() {
  try {
    // Cek apakah kategori Lainnya sudah ada
    const existing = await prisma.reportCategory.findFirst({
      where: {
        name: {
          equals: 'Lainnya',
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      console.log('ℹ️  Kategori "Lainnya" sudah ada di database');
      return existing;
    }

    // Tambahkan kategori Lainnya
    const lainnya = await prisma.reportCategory.create({
      data: {
        name: 'Lainnya',
        isActive: true,
        subcategories: {
          create: [
            { name: 'Lain-lain', isActive: true },
          ],
        },
      },
      include: {
        subcategories: true,
      },
    });

    console.log('✅ Kategori "Lainnya" berhasil ditambahkan:', lainnya);
    return lainnya;
  } catch (error) {
    console.error('❌ Error adding category:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addLainnyaCategory()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error);
    process.exit(1);
  });
