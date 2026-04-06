-- AlterTable: add missing columns to landing_pages that exist in schema but not in DB
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "theme" TEXT;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "content" JSONB DEFAULT '{}';
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "images" JSONB DEFAULT '[]';
