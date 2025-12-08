const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Script untuk migrate data Report lama
 * Mengupdate categoryId dan subcategoryId berdasarkan category dan subcategory text
 */
async function migrateReportCategories() {
  console.log('🚀 Starting Report Categories Migration...\n');

  try {
    // 1. Fetch all categories and subcategories
    console.log('📂 Fetching categories and subcategories...');
    const categories = await prisma.reportCategory.findMany({
      include: {
        subcategories: true,
      },
    });

    console.log(`✅ Found ${categories.length} categories\n`);

    // 2. Fetch all reports yang belum punya categoryId
    const reportsWithoutCategoryId = await prisma.report.findMany({
      where: {
        OR: [
          { categoryId: null },
          { subcategoryId: null },
        ],
      },
      select: {
        id: true,
        category: true,
        subcategory: true,
        categoryId: true,
        subcategoryId: true,
      },
    });

    console.log(`📊 Found ${reportsWithoutCategoryId.length} reports to migrate\n`);

    let updatedCount = 0;
    let notFoundCount = 0;
    const notFoundCategories = new Set();
    const notFoundSubcategories = new Set();

    // 3. Loop through reports and update
    for (const report of reportsWithoutCategoryId) {
      const updates = {};

      // Update categoryId jika belum ada
      if (!report.categoryId && report.category) {
        const matchedCategory = categories.find(
          (cat) => cat.name.toLowerCase() === report.category.toLowerCase()
        );

        if (matchedCategory) {
          updates.categoryId = matchedCategory.id;
        } else {
          notFoundCategories.add(report.category);
        }
      }

      // Update subcategoryId jika belum ada
      if (!report.subcategoryId && report.subcategory) {
        let matchedSubcategory = null;

        // Cari di semua kategori
        for (const category of categories) {
          matchedSubcategory = category.subcategories.find(
            (sub) => sub.name.toLowerCase() === report.subcategory.toLowerCase()
          );
          if (matchedSubcategory) break;
        }

        if (matchedSubcategory) {
          updates.subcategoryId = matchedSubcategory.id;
        } else {
          notFoundSubcategories.add(report.subcategory);
        }
      }

      // Update jika ada perubahan
      if (Object.keys(updates).length > 0) {
        await prisma.report.update({
          where: { id: report.id },
          data: updates,
        });
        updatedCount++;

        if (updatedCount % 10 === 0) {
          console.log(`⏳ Progress: ${updatedCount}/${reportsWithoutCategoryId.length} reports updated...`);
        }
      } else {
        notFoundCount++;
      }
    }

    // 4. Summary
    console.log('\n✅ Migration completed!');
    console.log('═══════════════════════════════════════════');
    console.log(`📊 Total reports processed: ${reportsWithoutCategoryId.length}`);
    console.log(`✅ Successfully updated: ${updatedCount}`);
    console.log(`⚠️  Not matched: ${notFoundCount}`);
    console.log('═══════════════════════════════════════════\n');

    if (notFoundCategories.size > 0) {
      console.log('⚠️  Categories not found in database:');
      notFoundCategories.forEach((cat) => console.log(`   - ${cat}`));
      console.log();
    }

    if (notFoundSubcategories.size > 0) {
      console.log('⚠️  Subcategories not found in database:');
      notFoundSubcategories.forEach((sub) => console.log(`   - ${sub}`));
      console.log();
    }

    // 5. Verification
    console.log('🔍 Verification:');
    const totalReports = await prisma.report.count();
    const reportsWithCategoryId = await prisma.report.count({
      where: { categoryId: { not: null } },
    });
    const reportsWithSubcategoryId = await prisma.report.count({
      where: { subcategoryId: { not: null } },
    });

    console.log(`   Total reports: ${totalReports}`);
    console.log(`   With categoryId: ${reportsWithCategoryId} (${((reportsWithCategoryId / totalReports) * 100).toFixed(1)}%)`);
    console.log(`   With subcategoryId: ${reportsWithSubcategoryId} (${((reportsWithSubcategoryId / totalReports) * 100).toFixed(1)}%)`);
    console.log();

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateReportCategories()
  .then(() => {
    console.log('✨ Migration script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });
