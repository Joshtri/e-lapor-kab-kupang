-- Drop foreign key constraints first
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_opdId_fkey";

-- Step 1: Create temporary columns with UUID type
ALTER TABLE "Notification" ADD COLUMN "userId_new" VARCHAR(50);
ALTER TABLE "Notification" ADD COLUMN "opdId_new" VARCHAR(50);

-- Step 2: Copy data (convert int to string for userId)
UPDATE "Notification" SET "userId_new" = CAST("userId" AS VARCHAR(50)) WHERE "userId" IS NOT NULL;

-- Step 3: For opdId, we need to get the OPD string ID based on the old int ID
-- This assumes there's a mapping or we're just converting the int to string
UPDATE "Notification" SET "opdId_new" = NULL WHERE "opdId" IS NULL;
-- If you need a specific mapping from int IDs to UUIDs, you would do that here
-- For now, setting to NULL since we can't map old int IDs to new UUID IDs without knowing the mapping

-- Step 4: Drop old columns
ALTER TABLE "Notification" DROP COLUMN "userId";
ALTER TABLE "Notification" DROP COLUMN "opdId";

-- Step 5: Rename new columns
ALTER TABLE "Notification" RENAME COLUMN "userId_new" TO "userId";
ALTER TABLE "Notification" RENAME COLUMN "opdId_new" TO "opdId";

-- Step 6: Re-create foreign key constraints
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "OPD"("id") ON DELETE SET NULL ON UPDATE CASCADE;
