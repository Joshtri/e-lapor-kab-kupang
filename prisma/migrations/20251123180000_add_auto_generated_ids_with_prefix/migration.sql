-- AlterTable: Add auto-generated ID defaults with prefixes
-- This migration adds default values for ID generation with specific prefixes for each model

-- User table: usr_ prefix
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(gen_random_uuid()::text, '-', ''));

-- OPD table: opd_ prefix
ALTER TABLE "OPD" ALTER COLUMN "id" SET DEFAULT concat('opd_', replace(gen_random_uuid()::text, '-', ''));

-- Report table: rep_ prefix
ALTER TABLE "Report" ALTER COLUMN "id" SET DEFAULT concat('rep_', replace(gen_random_uuid()::text, '-', ''));

-- Comment table: cmt_ prefix
ALTER TABLE "Comment" ALTER COLUMN "id" SET DEFAULT concat('cmt_', replace(gen_random_uuid()::text, '-', ''));

-- Log table: log_ prefix
ALTER TABLE "Log" ALTER COLUMN "id" SET DEFAULT concat('log_', replace(gen_random_uuid()::text, '-', ''));

-- BugReport table: bug_ prefix
ALTER TABLE "BugReport" ALTER COLUMN "id" SET DEFAULT concat('bug_', replace(gen_random_uuid()::text, '-', ''));

-- BugComment table: bgc_ prefix
ALTER TABLE "BugComment" ALTER COLUMN "id" SET DEFAULT concat('bgc_', replace(gen_random_uuid()::text, '-', ''));

-- Notification table: ntf_ prefix
ALTER TABLE "Notification" ALTER COLUMN "id" SET DEFAULT concat('ntf_', replace(gen_random_uuid()::text, '-', ''));

-- Email table: eml_ prefix
ALTER TABLE "Email" ALTER COLUMN "id" SET DEFAULT concat('eml_', replace(gen_random_uuid()::text, '-', ''));

-- ChatRoom table: crm_ prefix
ALTER TABLE "ChatRoom" ALTER COLUMN "id" SET DEFAULT concat('crm_', replace(gen_random_uuid()::text, '-', ''));

-- ChatMessage table: cmg_ prefix
ALTER TABLE "ChatMessage" ALTER COLUMN "id" SET DEFAULT concat('cmg_', replace(gen_random_uuid()::text, '-', ''));
