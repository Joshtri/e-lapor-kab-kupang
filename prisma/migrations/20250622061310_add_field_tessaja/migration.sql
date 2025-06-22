-- AlterTable
ALTER TABLE "User" ADD COLUMN     "testsaja" TEXT;

-- CreateTable
CREATE TABLE "Buku" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Buku_pkey" PRIMARY KEY ("id")
);
