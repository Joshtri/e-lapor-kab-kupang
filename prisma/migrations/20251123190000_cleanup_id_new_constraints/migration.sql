-- Migration: Clean up leftover _id_new_key constraints from UUID migration
-- These constraints were created during the UUID migration but not properly dropped
-- Foreign keys are referencing these old unique indexes, so we need to drop and recreate them

-- ============================================
-- Step 1: Drop all foreign key constraints that depend on the old unique indexes
-- ============================================

ALTER TABLE "Report" DROP CONSTRAINT IF EXISTS "Report_userId_fkey";
ALTER TABLE "Report" DROP CONSTRAINT IF EXISTS "Report_opdId_fkey";
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_reportId_fkey";
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_userId_fkey";
ALTER TABLE "Log" DROP CONSTRAINT IF EXISTS "Log_reportId_fkey";
ALTER TABLE "Log" DROP CONSTRAINT IF EXISTS "Log_userId_fkey";
ALTER TABLE "BugReport" DROP CONSTRAINT IF EXISTS "BugReport_userId_fkey";
ALTER TABLE "BugComment" DROP CONSTRAINT IF EXISTS "BugComment_bugReportId_fkey";
ALTER TABLE "BugComment" DROP CONSTRAINT IF EXISTS "BugComment_userId_fkey";
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_opdId_fkey";
ALTER TABLE "Email" DROP CONSTRAINT IF EXISTS "Email_senderId_fkey";
ALTER TABLE "Email" DROP CONSTRAINT IF EXISTS "Email_recipientId_fkey";
ALTER TABLE "ChatRoom" DROP CONSTRAINT IF EXISTS "ChatRoom_userId_fkey";
ALTER TABLE "ChatRoom" DROP CONSTRAINT IF EXISTS "ChatRoom_opdId_fkey";
ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_roomId_fkey";
ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_senderId_fkey";
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_opdId_fkey";

-- ============================================
-- Step 2: Drop all leftover unique constraints
-- ============================================

ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_id_new_key";
ALTER TABLE "OPD" DROP CONSTRAINT IF EXISTS "OPD_id_new_key";
ALTER TABLE "Report" DROP CONSTRAINT IF EXISTS "Report_id_new_key";
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_id_new_key";
ALTER TABLE "Log" DROP CONSTRAINT IF EXISTS "Log_id_new_key";
ALTER TABLE "BugReport" DROP CONSTRAINT IF EXISTS "BugReport_id_new_key";
ALTER TABLE "BugComment" DROP CONSTRAINT IF EXISTS "BugComment_id_new_key";
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_id_new_key";
ALTER TABLE "Email" DROP CONSTRAINT IF EXISTS "Email_id_new_key";
ALTER TABLE "ChatRoom" DROP CONSTRAINT IF EXISTS "ChatRoom_id_new_key";
ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_id_new_key";

-- ============================================
-- Step 3: Recreate all foreign key constraints pointing to primary keys
-- ============================================

ALTER TABLE "User" ADD CONSTRAINT "User_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Report" ADD CONSTRAINT "Report_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Log" ADD CONSTRAINT "Log_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BugComment" ADD CONSTRAINT "BugComment_bugReportId_fkey" FOREIGN KEY ("bugReportId") REFERENCES "BugReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BugComment" ADD CONSTRAINT "BugComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Email" ADD CONSTRAINT "Email_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Email" ADD CONSTRAINT "Email_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
