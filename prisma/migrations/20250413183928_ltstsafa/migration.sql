/*
  Warnings:

  - A unique constraint covering the columns `[nipNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nipNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_nipNumber_key" ON "User"("nipNumber");
