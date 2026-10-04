-- Brings the migration history in line with schema.prisma.
-- AppSettings and PushSubscription were added to the old database via `db push`
-- and never had a migration; the FK columns below are required in the datamodel.

-- DropIndex
DROP INDEX "Report_categoryId_idx";

-- DropIndex
DROP INDEX "Report_subcategoryId_idx";

-- AlterTable
ALTER TABLE "BugComment" ALTER COLUMN "id" SET DEFAULT concat('bgc_', replace(gen_random_uuid()::text, '-', '')),
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "bugReportId" SET NOT NULL;

-- AlterTable
ALTER TABLE "BugReport" ALTER COLUMN "id" SET DEFAULT concat('bug_', replace(gen_random_uuid()::text, '-', '')),
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "id" SET DEFAULT concat('cmg_', replace(gen_random_uuid()::text, '-', '')),
ALTER COLUMN "senderId" SET NOT NULL,
ALTER COLUMN "roomId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ChatRoom" ALTER COLUMN "id" SET DEFAULT concat('crm_', replace(gen_random_uuid()::text, '-', '')),
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "id" SET DEFAULT concat('cmt_', replace(gen_random_uuid()::text, '-', '')),
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "reportId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Email" ALTER COLUMN "id" SET DEFAULT concat('eml_', replace(gen_random_uuid()::text, '-', '')),
ALTER COLUMN "senderId" SET NOT NULL,
ALTER COLUMN "recipientId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "id" SET DEFAULT concat('log_', replace(gen_random_uuid()::text, '-', '')),
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "reportId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "id" SET DEFAULT concat('ntf_', replace(gen_random_uuid()::text, '-', ''));

-- AlterTable
ALTER TABLE "OPD" ALTER COLUMN "id" SET DEFAULT concat('opd_', replace(gen_random_uuid()::text, '-', ''));

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "id" SET DEFAULT concat('rep_', replace(gen_random_uuid()::text, '-', '')),
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ReportCategory" ALTER COLUMN "id" SET DEFAULT concat('rct_', replace(gen_random_uuid()::text, '-', ''));

-- AlterTable
ALTER TABLE "ReportSubcategory" ALTER COLUMN "id" SET DEFAULT concat('rsc_', replace(gen_random_uuid()::text, '-', ''));

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(gen_random_uuid()::text, '-', ''));

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" VARCHAR(50) NOT NULL DEFAULT concat('vps_', replace(gen_random_uuid()::text, '-', '')),
    "userId" VARCHAR(50) NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" VARCHAR(50) NOT NULL DEFAULT 'settings_main',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

