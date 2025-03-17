/*
  Warnings:

  - Added the required column `opdId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "opdId" INTEGER;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "opdId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OPD" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "staffFirstName" VARCHAR(100) NOT NULL,
    "staffMiddleName" VARCHAR(100),
    "staffLastName" VARCHAR(100) NOT NULL,
    "staffPosition" VARCHAR(100) NOT NULL,
    "staffEmail" VARCHAR(100),
    "staffPhoneNumber" VARCHAR(15),

    CONSTRAINT "OPD_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OPD_email_key" ON "OPD"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OPD_staffEmail_key" ON "OPD"("staffEmail");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE SET NULL ON UPDATE CASCADE;
