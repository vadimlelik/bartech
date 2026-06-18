-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "availability_status" TEXT NOT NULL DEFAULT 'in_stock';
