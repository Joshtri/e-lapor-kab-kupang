-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_opdId_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "opdId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE SET NULL ON UPDATE CASCADE;
