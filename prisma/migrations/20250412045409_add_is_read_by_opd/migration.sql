-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "isReadByBupati" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReadByOpd" BOOLEAN NOT NULL DEFAULT false;
