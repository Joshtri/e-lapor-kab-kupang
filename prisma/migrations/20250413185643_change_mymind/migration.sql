/*
  Warnings:

  - You are about to drop the column `nipNumber` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_nipNumber_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nipNumber";
