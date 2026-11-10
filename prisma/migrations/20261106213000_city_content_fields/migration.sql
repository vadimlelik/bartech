-- Падежи, флаги и уникальный контент города.
-- Коммерческие поля региональных городов очищаются: в сиде были заглушки и телефон Минска.

ALTER TABLE "cities" ADD COLUMN "name_genitive" TEXT NOT NULL DEFAULT '';
ALTER TABLE "cities" ADD COLUMN "name_dative" TEXT NOT NULL DEFAULT '';
ALTER TABLE "cities" ADD COLUMN "has_pickup" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "cities" ADD COLUMN "has_delivery" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "cities" ADD COLUMN "about_paragraphs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "cities" ADD COLUMN "faq" JSONB NOT NULL DEFAULT '[]';

UPDATE "cities"
SET
  "name_genitive" = 'Минска',
  "name_dative" = 'Минску',
  "has_pickup" = true,
  "has_delivery" = true
WHERE "slug" = 'minsk';

UPDATE "cities"
SET
  "name_in" = CASE "slug"
    WHEN 'grodno' THEN 'Гродно'
    WHEN 'brest' THEN 'Бресте'
    WHEN 'vitebsk' THEN 'Витебске'
    WHEN 'gomel' THEN 'Гомеле'
    WHEN 'mogilev' THEN 'Могилёве'
    ELSE "name_in"
  END,
  "name_genitive" = CASE "slug"
    WHEN 'grodno' THEN 'Гродно'
    WHEN 'brest' THEN 'Бреста'
    WHEN 'vitebsk' THEN 'Витебска'
    WHEN 'gomel' THEN 'Гомеля'
    WHEN 'mogilev' THEN 'Могилёва'
    ELSE "name_genitive"
  END,
  "name_dative" = CASE "slug"
    WHEN 'grodno' THEN 'Гродно'
    WHEN 'brest' THEN 'Бресту'
    WHEN 'vitebsk' THEN 'Витебску'
    WHEN 'gomel' THEN 'Гомелю'
    WHEN 'mogilev' THEN 'Могилёву'
    ELSE "name_dative"
  END,
  "phone_display" = '',
  "phone_tel" = '',
  "work_hours" = '',
  "postal_code" = NULL,
  "street_address" = '',
  "address_line" = '',
  "latitude" = NULL,
  "longitude" = NULL,
  "min_order_amount" = NULL,
  "free_delivery_from" = NULL,
  "has_pickup" = false,
  "has_delivery" = false
WHERE "slug" <> 'minsk';
