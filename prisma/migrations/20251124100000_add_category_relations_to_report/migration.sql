-- Add categoryId and subcategoryId to Report table
ALTER TABLE "Report" ADD COLUMN "categoryId" VARCHAR(50);
ALTER TABLE "Report" ADD COLUMN "subcategoryId" VARCHAR(50);

-- Make existing category and subcategory columns nullable for backward compatibility
ALTER TABLE "Report" ALTER COLUMN "category" DROP NOT NULL;
ALTER TABLE "Report" ALTER COLUMN "subcategory" DROP NOT NULL;

-- Update existing category and subcategory columns to VARCHAR(255)
ALTER TABLE "Report" ALTER COLUMN "category" TYPE VARCHAR(255);
ALTER TABLE "Report" ALTER COLUMN "subcategory" TYPE VARCHAR(255);

-- Add foreign key constraints
ALTER TABLE "Report"
  ADD CONSTRAINT "Report_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "ReportCategory"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

ALTER TABLE "Report"
  ADD CONSTRAINT "Report_subcategoryId_fkey"
  FOREIGN KEY ("subcategoryId") REFERENCES "ReportSubcategory"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Create indexes for better query performance
CREATE INDEX "Report_categoryId_idx" ON "Report"("categoryId");
CREATE INDEX "Report_subcategoryId_idx" ON "Report"("subcategoryId");
