/*
  Warnings:

  - Made the column `category` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subcategory` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "subcategory" SET NOT NULL,
ALTER COLUMN "subcategory" DROP DEFAULT;
