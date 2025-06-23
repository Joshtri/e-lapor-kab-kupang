/*
  Warnings:

  - You are about to drop the column `testsaja` on the `User` table. All the data in the column will be lost.
  - The `avatarUrl` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "testsaja",
DROP COLUMN "avatarUrl",
ADD COLUMN     "avatarUrl" BYTEA;
