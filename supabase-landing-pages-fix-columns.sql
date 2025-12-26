-- Исправление таблицы landing_pages - добавление недостающих колонок
-- Выполните этот SQL в SQL Editor в Supabase Dashboard если возникла ошибка про отсутствующие колонки

-- Сначала создаем таблицу, если её нет
CREATE TABLE IF NOT EXISTS landing_pages (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  main_title TEXT,
  description TEXT,
  main_image TEXT,
  secondary_image TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  advantages JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  pixels JSONB DEFAULT '[]'::jsonb,
  button_text TEXT DEFAULT 'Узнать цену',
  survey_text TEXT,
  colors JSONB DEFAULT '{}'::jsonb,
  styles JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Добавляем недостающие колонки если таблица уже существует
DO $$ 
BEGIN
    -- main_title
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'main_title'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN main_title TEXT;
    END IF;

    -- description
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'description'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN description TEXT;
    END IF;

    -- main_image
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'main_image'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN main_image TEXT;
    END IF;

    -- secondary_image
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'secondary_image'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN secondary_image TEXT;
    END IF;

    -- benefits
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'benefits'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN benefits JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- advantages
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'advantages'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN advantages JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- reviews
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'reviews'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN reviews JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- pixels
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'pixels'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN pixels JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- button_text
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'button_text'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN button_text TEXT DEFAULT 'Узнать цену';
    END IF;

    -- survey_text
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'survey_text'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN survey_text TEXT;
    END IF;

    -- colors
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'colors'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN colors JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- styles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'styles'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN styles JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- is_active
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;

    -- created_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;

    -- updated_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE landing_pages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;
END $$;

-- Исправляем колонку theme если она существует и имеет NOT NULL
-- Делаем её nullable, чтобы не было ошибок при создании лендингов
DO $$
BEGIN
    -- Проверяем, существует ли колонка theme
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'landing_pages' 
        AND column_name = 'theme'
    ) THEN
        -- Пытаемся сделать колонку nullable
        BEGIN
            ALTER TABLE landing_pages ALTER COLUMN theme DROP NOT NULL;
        EXCEPTION WHEN OTHERS THEN
            -- Если не получилось, пробуем добавить DEFAULT значение
            BEGIN
                ALTER TABLE landing_pages ALTER COLUMN theme SET DEFAULT '';
            EXCEPTION WHEN OTHERS THEN
                -- Если и это не получилось, просто игнорируем
                NULL;
            END;
        END;
    END IF;
END $$;

-- Создаем индексы если их нет
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_is_active ON landing_pages(is_active);
CREATE INDEX IF NOT EXISTS idx_landing_pages_title ON landing_pages(title);

-- Создаем триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_landing_pages_updated_at ON landing_pages;
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Включаем Row Level Security если еще не включен
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности
DROP POLICY IF EXISTS "Allow public read access active landings" ON landing_pages;
CREATE POLICY "Allow public read access active landings" ON landing_pages
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow admin read all landings" ON landing_pages;
CREATE POLICY "Allow admin read all landings" ON landing_pages
    FOR SELECT USING (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.role() = 'service_role' OR 
        (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
    );

DROP POLICY IF EXISTS "Allow admin insert landings" ON landing_pages;
CREATE POLICY "Allow admin insert landings" ON landing_pages
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.role() = 'service_role' OR 
        (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
    );

DROP POLICY IF EXISTS "Allow admin update landings" ON landing_pages;
CREATE POLICY "Allow admin update landings" ON landing_pages
    FOR UPDATE USING (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.role() = 'service_role' OR 
        (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
    )
    WITH CHECK (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.role() = 'service_role' OR 
        (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
    );

DROP POLICY IF EXISTS "Allow admin delete landings" ON landing_pages;
CREATE POLICY "Allow admin delete landings" ON landing_pages
    FOR DELETE USING (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.role() = 'service_role' OR 
        (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
    );

-- ВАЖНО: После выполнения этого скрипта подождите 1-2 минуты для обновления кэша схемы Supabase
-- Если ошибка сохраняется, попробуйте перезапустить Supabase проект

