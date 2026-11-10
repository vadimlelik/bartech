-- Выбранный населённый пункт в профиле. Витринный city_slug не меняется.

ALTER TABLE "users" ADD COLUMN "locality_id" INTEGER;

CREATE INDEX "users_locality_id_idx" ON "users"("locality_id");

ALTER TABLE "users" ADD CONSTRAINT "users_locality_id_fkey" FOREIGN KEY ("locality_id") REFERENCES "localities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
