-- AlterTable: Add opdId to User table if it doesn't exist
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "opdId" VARCHAR(50);

-- Migrate data: Set User.opdId based on OPD.staffUserId relationship
UPDATE "User" u
SET "opdId" = o."id"
FROM "OPD" o
WHERE u."id" = o."staffUserId"
AND u."opdId" IS NULL;

-- Drop the old staffUserId column from OPD if it exists
ALTER TABLE "OPD" DROP COLUMN IF EXISTS "staffUserId";
