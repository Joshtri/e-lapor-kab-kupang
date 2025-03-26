-- AlterEnum
ALTER TYPE "Category" ADD VALUE 'KEAMANAN';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "location" TEXT NOT NULL DEFAULT '-';
