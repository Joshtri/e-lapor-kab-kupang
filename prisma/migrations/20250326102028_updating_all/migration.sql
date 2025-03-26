/*
  Warnings:

  - You are about to drop the column `priority` on the `BugReport` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `BugReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BugReport" DROP COLUMN "priority",
DROP COLUMN "status",
ADD COLUMN     "priorityProblem" "BugPriority" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "statusProblem" "BugStatus" NOT NULL DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
