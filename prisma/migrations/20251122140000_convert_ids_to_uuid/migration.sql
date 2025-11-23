-- Migration: Convert all integer IDs to UUID with custom prefixes
-- Format: prefix_<random-uuid>
-- This migration preserves all data while converting ID types

-- ============================================
-- Step 1: Add new UUID columns with temporary names (larger VARCHAR to accommodate UUID with prefix)
-- ============================================

ALTER TABLE "User" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "OPD" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "Report" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "Comment" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "Log" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "BugReport" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "BugComment" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "Notification" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "Email" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "ChatRoom" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;
ALTER TABLE "ChatMessage" ADD COLUMN "id_new" VARCHAR(50) DEFAULT NULL;

-- ============================================
-- Step 2: Populate new UUID columns with prefixed UUIDs
-- ============================================

UPDATE "User" SET "id_new" = CONCAT('usr_', gen_random_uuid()::TEXT);
UPDATE "OPD" SET "id_new" = CONCAT('opd_', gen_random_uuid()::TEXT);
UPDATE "Report" SET "id_new" = CONCAT('rpt_', gen_random_uuid()::TEXT);
UPDATE "Comment" SET "id_new" = CONCAT('cmt_', gen_random_uuid()::TEXT);
UPDATE "Log" SET "id_new" = CONCAT('log_', gen_random_uuid()::TEXT);
UPDATE "BugReport" SET "id_new" = CONCAT('bug_', gen_random_uuid()::TEXT);
UPDATE "BugComment" SET "id_new" = CONCAT('bgc_', gen_random_uuid()::TEXT);
UPDATE "Notification" SET "id_new" = CONCAT('ntf_', gen_random_uuid()::TEXT);
UPDATE "Email" SET "id_new" = CONCAT('eml_', gen_random_uuid()::TEXT);
UPDATE "ChatRoom" SET "id_new" = CONCAT('chr_', gen_random_uuid()::TEXT);
UPDATE "ChatMessage" SET "id_new" = CONCAT('chm_', gen_random_uuid()::TEXT);

-- Make the new columns NOT NULL after populating
ALTER TABLE "User" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "OPD" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "Report" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "Comment" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "Log" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "BugReport" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "BugComment" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "Notification" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "Email" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "ChatRoom" ALTER COLUMN "id_new" SET NOT NULL;
ALTER TABLE "ChatMessage" ALTER COLUMN "id_new" SET NOT NULL;

-- ============================================
-- Step 3: Add unique constraints on new UUID columns
-- ============================================

ALTER TABLE "User" ADD CONSTRAINT "User_id_new_key" UNIQUE ("id_new");
ALTER TABLE "OPD" ADD CONSTRAINT "OPD_id_new_key" UNIQUE ("id_new");
ALTER TABLE "Report" ADD CONSTRAINT "Report_id_new_key" UNIQUE ("id_new");
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_id_new_key" UNIQUE ("id_new");
ALTER TABLE "Log" ADD CONSTRAINT "Log_id_new_key" UNIQUE ("id_new");
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_id_new_key" UNIQUE ("id_new");
ALTER TABLE "BugComment" ADD CONSTRAINT "BugComment_id_new_key" UNIQUE ("id_new");
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_id_new_key" UNIQUE ("id_new");
ALTER TABLE "Email" ADD CONSTRAINT "Email_id_new_key" UNIQUE ("id_new");
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_id_new_key" UNIQUE ("id_new");
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_id_new_key" UNIQUE ("id_new");

-- ============================================
-- Step 4: Add new FK columns
-- ============================================

ALTER TABLE "Report" ADD COLUMN "userId_new" VARCHAR(50);
ALTER TABLE "Report" ADD COLUMN "opdId_new" VARCHAR(50);
ALTER TABLE "Comment" ADD COLUMN "userId_new" VARCHAR(50);
ALTER TABLE "Comment" ADD COLUMN "reportId_new" VARCHAR(50);
ALTER TABLE "Log" ADD COLUMN "userId_new" VARCHAR(50);
ALTER TABLE "Log" ADD COLUMN "reportId_new" VARCHAR(50);
ALTER TABLE "BugReport" ADD COLUMN "userId_new" VARCHAR(50);
ALTER TABLE "BugComment" ADD COLUMN "userId_new" VARCHAR(50);
ALTER TABLE "BugComment" ADD COLUMN "bugReportId_new" VARCHAR(50);
ALTER TABLE "Notification" ADD COLUMN "userId_new" VARCHAR(50);
ALTER TABLE "Email" ADD COLUMN "senderId_new" VARCHAR(50);
ALTER TABLE "Email" ADD COLUMN "recipientId_new" VARCHAR(50);
ALTER TABLE "ChatRoom" ADD COLUMN "userId_new" VARCHAR(50);
ALTER TABLE "ChatRoom" ADD COLUMN "opdId_new" VARCHAR(50);
ALTER TABLE "ChatMessage" ADD COLUMN "senderId_new" VARCHAR(50);
ALTER TABLE "ChatMessage" ADD COLUMN "roomId_new" VARCHAR(50);
ALTER TABLE "OPD" ADD COLUMN "staffUserId_new" VARCHAR(50);

-- ============================================
-- Step 5: Migrate foreign key data
-- ============================================

UPDATE "Report" SET "userId_new" = u."id_new" FROM "User" u WHERE "Report"."userId" = u."id";
UPDATE "Report" SET "opdId_new" = o."id_new" FROM "OPD" o WHERE "Report"."opdId" = o."id";
UPDATE "Comment" SET "userId_new" = u."id_new" FROM "User" u WHERE "Comment"."userId" = u."id";
UPDATE "Comment" SET "reportId_new" = r."id_new" FROM "Report" r WHERE "Comment"."reportId" = r."id";
UPDATE "Log" SET "userId_new" = u."id_new" FROM "User" u WHERE "Log"."userId" = u."id";
UPDATE "Log" SET "reportId_new" = r."id_new" FROM "Report" r WHERE "Log"."reportId" = r."id";
UPDATE "BugReport" SET "userId_new" = u."id_new" FROM "User" u WHERE "BugReport"."userId" = u."id";
UPDATE "BugComment" SET "userId_new" = u."id_new" FROM "User" u WHERE "BugComment"."userId" = u."id";
UPDATE "BugComment" SET "bugReportId_new" = b."id_new" FROM "BugReport" b WHERE "BugComment"."bugReportId" = b."id";
UPDATE "Notification" SET "userId_new" = u."id_new" FROM "User" u WHERE "Notification"."userId" = u."id";
UPDATE "Email" SET "senderId_new" = u."id_new" FROM "User" u WHERE "Email"."senderId" = u."id";
UPDATE "Email" SET "recipientId_new" = u."id_new" FROM "User" u WHERE "Email"."recipientId" = u."id";
UPDATE "ChatRoom" SET "userId_new" = u."id_new" FROM "User" u WHERE "ChatRoom"."userId" = u."id";
UPDATE "ChatRoom" SET "opdId_new" = o."id_new" FROM "OPD" o WHERE "ChatRoom"."opdId" = o."id";
UPDATE "ChatMessage" SET "senderId_new" = u."id_new" FROM "User" u WHERE "ChatMessage"."senderId" = u."id";
UPDATE "ChatMessage" SET "roomId_new" = c."id_new" FROM "ChatRoom" c WHERE "ChatMessage"."roomId" = c."id";
UPDATE "OPD" SET "staffUserId_new" = u."id_new" FROM "User" u WHERE "OPD"."staffUserId" = u."id";
