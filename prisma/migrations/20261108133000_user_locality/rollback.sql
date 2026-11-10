ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_locality_id_fkey";

DROP INDEX IF EXISTS "users_locality_id_idx";

ALTER TABLE "users" DROP COLUMN IF EXISTS "locality_id";
