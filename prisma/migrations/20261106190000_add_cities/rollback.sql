-- Откат городов. Товары, цены, наличие, заявки и пользователи сохраняются.
-- У пользователей пропадает только сохранённый город (колонка city_slug).

DROP TABLE IF EXISTS "banners";
DROP TABLE IF EXISTS "city_payment_methods";
DROP TABLE IF EXISTS "city_pickup_points";
DROP TABLE IF EXISTS "city_delivery_methods";
DROP TABLE IF EXISTS "cities";

DROP INDEX IF EXISTS "users_city_slug_idx";
ALTER TABLE "users" DROP COLUMN IF EXISTS "city_slug";
