/*
  Warnings:

  - You are about to drop the column `staffEmail` on the `OPD` table. All the data in the column will be lost.
  - You are about to drop the column `staffFirstName` on the `OPD` table. All the data in the column will be lost.
  - You are about to drop the column `staffLastName` on the `OPD` table. All the data in the column will be lost.
  - You are about to drop the column `staffMiddleName` on the `OPD` table. All the data in the column will be lost.
  - You are about to drop the column `staffPhoneNumber` on the `OPD` table. All the data in the column will be lost.
  - You are about to drop the column `staffPosition` on the `OPD` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `OPD` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `OPD` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OPD_staffEmail_key";

-- DropIndex
DROP INDEX "OPD_userId_key";

-- AlterTable
ALTER TABLE "OPD" DROP COLUMN "staffEmail",
DROP COLUMN "staffFirstName",
DROP COLUMN "staffLastName",
DROP COLUMN "staffMiddleName",
DROP COLUMN "staffPhoneNumber",
DROP COLUMN "staffPosition",
DROP COLUMN "userId",
ADD COLUMN     "alamat" VARCHAR(255),
ADD COLUMN     "email" VARCHAR(100),
ADD COLUMN     "telp" VARCHAR(20),
ADD COLUMN     "website" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "OPD_email_key" ON "OPD"("email");
