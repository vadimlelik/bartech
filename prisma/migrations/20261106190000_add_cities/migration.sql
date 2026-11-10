-- Города магазина. Существующие товары, заказы и пользователи не удаляются.
-- Все текущие цены и наличие остаются общими (данные Минска).

ALTER TABLE "users" ADD COLUMN "city_slug" TEXT;

CREATE INDEX "users_city_slug_idx" ON "users"("city_slug");

CREATE TABLE "cities" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_in" TEXT NOT NULL,
    "region_name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "phone_display" TEXT NOT NULL,
    "phone_tel" TEXT NOT NULL,
    "email" TEXT,
    "work_hours" TEXT NOT NULL,
    "postal_code" TEXT,
    "street_address" TEXT NOT NULL,
    "address_line" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "messengers" JSONB NOT NULL DEFAULT '[]',
    "min_order_amount" INTEGER,
    "free_delivery_from" INTEGER,
    "delivery_localities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "installment_terms" JSONB NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("slug")
);

CREATE TABLE "city_delivery_methods" (
    "id" TEXT NOT NULL,
    "city_slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL DEFAULT 0,
    "eta" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "city_delivery_methods_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "city_delivery_methods_city_slug_idx" ON "city_delivery_methods"("city_slug");

ALTER TABLE "city_delivery_methods"
ADD CONSTRAINT "city_delivery_methods_city_slug_fkey"
FOREIGN KEY ("city_slug") REFERENCES "cities"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "city_pickup_points" (
    "id" TEXT NOT NULL,
    "city_slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hours" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "city_pickup_points_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "city_pickup_points_city_slug_idx" ON "city_pickup_points"("city_slug");

ALTER TABLE "city_pickup_points"
ADD CONSTRAINT "city_pickup_points_city_slug_fkey"
FOREIGN KEY ("city_slug") REFERENCES "cities"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "city_payment_methods" (
    "id" TEXT NOT NULL,
    "city_slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "city_payment_methods_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "city_payment_methods_city_slug_idx" ON "city_payment_methods"("city_slug");

ALTER TABLE "city_payment_methods"
ADD CONSTRAINT "city_payment_methods_city_slug_fkey"
FOREIGN KEY ("city_slug") REFERENCES "cities"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "href" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "placement" TEXT NOT NULL DEFAULT 'home',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "city_slugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "banners_placement_enabled_idx" ON "banners"("placement", "enabled");

-- Одинаковые условия рассрочки для всех городов (подтверждено владельцем).
-- Региональные тарифы доставки не заполнены: города выключены, пока нет таблицы тарифов.

INSERT INTO "cities" (
    "slug", "name", "name_in", "region_name", "enabled", "is_default",
    "phone_display", "phone_tel", "email", "work_hours",
    "postal_code", "street_address", "address_line",
    "latitude", "longitude", "messengers",
    "min_order_amount", "free_delivery_from", "delivery_localities",
    "installment_terms", "sort_order", "updated_at"
) VALUES
(
    'minsk', 'Минск', 'Минске', 'Минская область', true, true,
    '+375 44 741-84-23', '+375447418423', 'baratexby@gmail.com',
    'Понедельник–пятница, 9:00–21:00',
    '220013', 'ул. Сурганова, д. 43, пом. 804',
    '220013, г. Минск, ул. Сурганова, д. 43, пом. 804',
    53.9085, 27.5685, '[]'::jsonb,
    NULL, 1000, ARRAY['Минск']::TEXT[],
    '{"months":[6,10,12],"defaultMonths":12,"downPaymentPercent":10,"bullets":["Срок рассрочки: до 12 месяцев","Первоначальный взнос: от 10% (в акциях — без взноса)","Без переплат и скрытых комиссий","Одобрение в течение 15–30 минут","Достаточно паспорта гражданина Республики Беларусь"]}'::jsonb,
    0, CURRENT_TIMESTAMP
),
(
    'grodno', 'Гродно', 'Гродно', 'Гродненская область', false, false,
    '+375 44 741-84-23', '+375447418423', 'baratexby@gmail.com',
    'Понедельник–пятница, 9:00–21:00',
    NULL, '', 'Адрес в Гродно уточняется',
    NULL, NULL, '[]'::jsonb,
    NULL, NULL, ARRAY['Гродно']::TEXT[],
    '{"months":[6,10,12],"defaultMonths":12,"downPaymentPercent":10,"bullets":["Срок рассрочки: до 12 месяцев","Первоначальный взнос: от 10% (в акциях — без взноса)","Без переплат и скрытых комиссий","Одобрение в течение 15–30 минут","Достаточно паспорта гражданина Республики Беларусь"]}'::jsonb,
    1, CURRENT_TIMESTAMP
),
(
    'brest', 'Брест', 'Бресте', 'Брестская область', false, false,
    '+375 44 741-84-23', '+375447418423', 'baratexby@gmail.com',
    'Понедельник–пятница, 9:00–21:00',
    NULL, '', 'Адрес в Бресте уточняется',
    NULL, NULL, '[]'::jsonb,
    NULL, NULL, ARRAY['Брест']::TEXT[],
    '{"months":[6,10,12],"defaultMonths":12,"downPaymentPercent":10,"bullets":["Срок рассрочки: до 12 месяцев","Первоначальный взнос: от 10% (в акциях — без взноса)","Без переплат и скрытых комиссий","Одобрение в течение 15–30 минут","Достаточно паспорта гражданина Республики Беларусь"]}'::jsonb,
    2, CURRENT_TIMESTAMP
),
(
    'vitebsk', 'Витебск', 'Витебске', 'Витебская область', false, false,
    '+375 44 741-84-23', '+375447418423', 'baratexby@gmail.com',
    'Понедельник–пятница, 9:00–21:00',
    NULL, '', 'Адрес в Витебске уточняется',
    NULL, NULL, '[]'::jsonb,
    NULL, NULL, ARRAY['Витебск']::TEXT[],
    '{"months":[6,10,12],"defaultMonths":12,"downPaymentPercent":10,"bullets":["Срок рассрочки: до 12 месяцев","Первоначальный взнос: от 10% (в акциях — без взноса)","Без переплат и скрытых комиссий","Одобрение в течение 15–30 минут","Достаточно паспорта гражданина Республики Беларусь"]}'::jsonb,
    3, CURRENT_TIMESTAMP
),
(
    'gomel', 'Гомель', 'Гомеле', 'Гомельская область', false, false,
    '+375 44 741-84-23', '+375447418423', 'baratexby@gmail.com',
    'Понедельник–пятница, 9:00–21:00',
    NULL, '', 'Адрес в Гомеле уточняется',
    NULL, NULL, '[]'::jsonb,
    NULL, NULL, ARRAY['Гомель']::TEXT[],
    '{"months":[6,10,12],"defaultMonths":12,"downPaymentPercent":10,"bullets":["Срок рассрочки: до 12 месяцев","Первоначальный взнос: от 10% (в акциях — без взноса)","Без переплат и скрытых комиссий","Одобрение в течение 15–30 минут","Достаточно паспорта гражданина Республики Беларусь"]}'::jsonb,
    4, CURRENT_TIMESTAMP
),
(
    'mogilev', 'Могилёв', 'Могилёве', 'Могилёвская область', false, false,
    '+375 44 741-84-23', '+375447418423', 'baratexby@gmail.com',
    'Понедельник–пятница, 9:00–21:00',
    NULL, '', 'Адрес в Могилёве уточняется',
    NULL, NULL, '[]'::jsonb,
    NULL, NULL, ARRAY['Могилёв']::TEXT[],
    '{"months":[6,10,12],"defaultMonths":12,"downPaymentPercent":10,"bullets":["Срок рассрочки: до 12 месяцев","Первоначальный взнос: от 10% (в акциях — без взноса)","Без переплат и скрытых комиссий","Одобрение в течение 15–30 минут","Достаточно паспорта гражданина Республики Беларусь"]}'::jsonb,
    5, CURRENT_TIMESTAMP
);

INSERT INTO "city_delivery_methods" ("id", "city_slug", "code", "title", "description", "price", "eta", "enabled", "sort_order") VALUES
('minsk-courier', 'minsk', 'courier', 'Курьер по Минску', 'Доставка по городу', 10, 'В день заказа или на следующий день', true, 0),
('minsk-region', 'minsk', 'region', 'Доставка по Беларуси', 'Доставка за пределы Минска', 15, '1–3 рабочих дня', true, 1),
('minsk-pickup', 'minsk', 'pickup', 'Самовывоз', 'Пункт выдачи в Минске', 0, 'В день заказа', true, 2);

INSERT INTO "city_pickup_points" ("id", "city_slug", "title", "address", "hours", "enabled", "sort_order") VALUES
('minsk-surgonova', 'minsk', 'Texnobar, Сурганова', 'г. Минск, ул. Сурганова, д. 43, пом. 804', 'Пн–Пт 9:00–21:00', true, 0);

INSERT INTO "city_payment_methods" ("id", "city_slug", "code", "title", "enabled", "sort_order") VALUES
('minsk-card-online', 'minsk', 'card_online', 'Банковской картой онлайн', true, 0),
('minsk-cash', 'minsk', 'cash', 'Наличными при получении', true, 1),
('minsk-card-delivery', 'minsk', 'card_delivery', 'Картой при получении', true, 2),
('minsk-invoice', 'minsk', 'invoice', 'Безналичный расчет для юридических лиц', true, 3),
('minsk-installment', 'minsk', 'installment', 'Рассрочка', true, 4);
