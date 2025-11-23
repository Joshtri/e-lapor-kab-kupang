-- Migration: Finalize UUID conversion by swapping columns and dropping old ones
-- This is the second phase after data has been migrated to new UUID columns

-- ============================================
-- Step 1: Drop all foreign key constraints
-- ============================================

-- User constraints
ALTER TABLE "OPD" DROP CONSTRAINT IF EXISTS "OPD_staffUserId_fkey" CASCADE;
ALTER TABLE "Report" DROP CONSTRAINT IF EXISTS "Report_userId_fkey" CASCADE;
ALTER TABLE "Report" DROP CONSTRAINT IF EXISTS "Report_opdId_fkey" CASCADE;
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_reportId_fkey" CASCADE;
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_userId_fkey" CASCADE;
ALTER TABLE "Log" DROP CONSTRAINT IF EXISTS "Log_reportId_fkey" CASCADE;
ALTER TABLE "Log" DROP CONSTRAINT IF EXISTS "Log_userId_fkey" CASCADE;
ALTER TABLE "BugReport" DROP CONSTRAINT IF EXISTS "BugReport_userId_fkey" CASCADE;
ALTER TABLE "BugComment" DROP CONSTRAINT IF EXISTS "BugComment_bugReportId_fkey" CASCADE;
ALTER TABLE "BugComment" DROP CONSTRAINT IF EXISTS "BugComment_userId_fkey" CASCADE;
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey" CASCADE;
ALTER TABLE "Email" DROP CONSTRAINT IF EXISTS "Email_senderId_fkey" CASCADE;
ALTER TABLE "Email" DROP CONSTRAINT IF EXISTS "Email_recipientId_fkey" CASCADE;
ALTER TABLE "ChatRoom" DROP CONSTRAINT IF EXISTS "ChatRoom_userId_fkey" CASCADE;
ALTER TABLE "ChatRoom" DROP CONSTRAINT IF EXISTS "ChatRoom_opdId_fkey" CASCADE;
ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_roomId_fkey" CASCADE;
ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_senderId_fkey" CASCADE;

-- ============================================
-- Step 2: Drop primary key constraints
-- ============================================

ALTER TABLE "User" DROP CONSTRAINT "User_pkey" CASCADE;
ALTER TABLE "OPD" DROP CONSTRAINT "OPD_pkey" CASCADE;
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey" CASCADE;
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey" CASCADE;
ALTER TABLE "Log" DROP CONSTRAINT "Log_pkey" CASCADE;
ALTER TABLE "BugReport" DROP CONSTRAINT "BugReport_pkey" CASCADE;
ALTER TABLE "BugComment" DROP CONSTRAINT "BugComment_pkey" CASCADE;
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey" CASCADE;
ALTER TABLE "Email" DROP CONSTRAINT "Email_pkey" CASCADE;
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_pkey" CASCADE;
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_pkey" CASCADE;

-- ============================================
-- Step 3: Drop old ID columns
-- ============================================

ALTER TABLE "User" DROP COLUMN "id";
ALTER TABLE "OPD" DROP COLUMN "id";
ALTER TABLE "Report" DROP COLUMN "id";
ALTER TABLE "Comment" DROP COLUMN "id";
ALTER TABLE "Log" DROP COLUMN "id";
ALTER TABLE "BugReport" DROP COLUMN "id";
ALTER TABLE "BugComment" DROP COLUMN "id";
ALTER TABLE "Notification" DROP COLUMN "id";
ALTER TABLE "Email" DROP COLUMN "id";
ALTER TABLE "ChatRoom" DROP COLUMN "id";
ALTER TABLE "ChatMessage" DROP COLUMN "id";

-- ============================================
-- Step 4: Rename new UUID columns to original ID names
-- ============================================

ALTER TABLE "User" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "OPD" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Report" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Comment" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Log" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "BugReport" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "BugComment" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Notification" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Email" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "ChatRoom" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "ChatMessage" RENAME COLUMN "id_new" TO "id";

-- ============================================
-- Step 5: Drop old FK columns and rename new ones
-- ============================================

-- OPD - staffUserId
ALTER TABLE "OPD" DROP COLUMN "staffUserId";
ALTER TABLE "OPD" RENAME COLUMN "staffUserId_new" TO "staffUserId";

-- Report - userId & opdId
ALTER TABLE "Report" DROP COLUMN "userId";
ALTER TABLE "Report" RENAME COLUMN "userId_new" TO "userId";
ALTER TABLE "Report" DROP COLUMN "opdId";
ALTER TABLE "Report" RENAME COLUMN "opdId_new" TO "opdId";

-- Comment - userId & reportId
ALTER TABLE "Comment" DROP COLUMN "userId";
ALTER TABLE "Comment" RENAME COLUMN "userId_new" TO "userId";
ALTER TABLE "Comment" DROP COLUMN "reportId";
ALTER TABLE "Comment" RENAME COLUMN "reportId_new" TO "reportId";

-- Log - userId & reportId
ALTER TABLE "Log" DROP COLUMN "userId";
ALTER TABLE "Log" RENAME COLUMN "userId_new" TO "userId";
ALTER TABLE "Log" DROP COLUMN "reportId";
ALTER TABLE "Log" RENAME COLUMN "reportId_new" TO "reportId";

-- BugReport - userId
ALTER TABLE "BugReport" DROP COLUMN "userId";
ALTER TABLE "BugReport" RENAME COLUMN "userId_new" TO "userId";

-- BugComment - userId & bugReportId
ALTER TABLE "BugComment" DROP COLUMN "userId";
ALTER TABLE "BugComment" RENAME COLUMN "userId_new" TO "userId";
ALTER TABLE "BugComment" DROP COLUMN "bugReportId";
ALTER TABLE "BugComment" RENAME COLUMN "bugReportId_new" TO "bugReportId";

-- Notification - userId
ALTER TABLE "Notification" DROP COLUMN "userId";
ALTER TABLE "Notification" RENAME COLUMN "userId_new" TO "userId";

-- Email - senderId & recipientId
ALTER TABLE "Email" DROP COLUMN "senderId";
ALTER TABLE "Email" RENAME COLUMN "senderId_new" TO "senderId";
ALTER TABLE "Email" DROP COLUMN "recipientId";
ALTER TABLE "Email" RENAME COLUMN "recipientId_new" TO "recipientId";

-- ChatRoom - userId & opdId
ALTER TABLE "ChatRoom" DROP COLUMN "userId";
ALTER TABLE "ChatRoom" RENAME COLUMN "userId_new" TO "userId";
ALTER TABLE "ChatRoom" DROP COLUMN "opdId";
ALTER TABLE "ChatRoom" RENAME COLUMN "opdId_new" TO "opdId";

-- ChatMessage - senderId & roomId
ALTER TABLE "ChatMessage" DROP COLUMN "senderId";
ALTER TABLE "ChatMessage" RENAME COLUMN "senderId_new" TO "senderId";
ALTER TABLE "ChatMessage" DROP COLUMN "roomId";
ALTER TABLE "ChatMessage" RENAME COLUMN "roomId_new" TO "roomId";

-- ============================================
-- Step 6: Add primary key constraints
-- ============================================

ALTER TABLE "User" ADD PRIMARY KEY ("id");
ALTER TABLE "OPD" ADD PRIMARY KEY ("id");
ALTER TABLE "Report" ADD PRIMARY KEY ("id");
ALTER TABLE "Comment" ADD PRIMARY KEY ("id");
ALTER TABLE "Log" ADD PRIMARY KEY ("id");
ALTER TABLE "BugReport" ADD PRIMARY KEY ("id");
ALTER TABLE "BugComment" ADD PRIMARY KEY ("id");
ALTER TABLE "Notification" ADD PRIMARY KEY ("id");
ALTER TABLE "Email" ADD PRIMARY KEY ("id");
ALTER TABLE "ChatRoom" ADD PRIMARY KEY ("id");
ALTER TABLE "ChatMessage" ADD PRIMARY KEY ("id");

-- ============================================
-- Step 7: Add foreign key constraints
-- ============================================

ALTER TABLE "OPD" ADD CONSTRAINT "OPD_staffUserId_fkey" FOREIGN KEY ("staffUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
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
ALTER TABLE "Email" ADD CONSTRAINT "Email_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Email" ADD CONSTRAINT "Email_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
