-- CreateTable
CREATE TABLE "ReportCategory" (
    "id" VARCHAR(50) NOT NULL DEFAULT concat('rct_', replace(gen_random_uuid()::text, '-', '')),
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSubcategory" (
    "id" VARCHAR(50) NOT NULL DEFAULT concat('rsc_', replace(gen_random_uuid()::text, '-', '')),
    "categoryId" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportSubcategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportSubcategory" ADD CONSTRAINT "ReportSubcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReportCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
