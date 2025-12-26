-- Создание таблицы landing_pages в Supabase
-- Выполните этот SQL в SQL Editor в Supabase Dashboard

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

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_is_active ON landing_pages(is_active);
CREATE INDEX IF NOT EXISTS idx_landing_pages_title ON landing_pages(title);

-- Создание триггера для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_landing_pages_updated_at ON landing_pages;
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Включение Row Level Security
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- Политика для чтения (все могут читать активные лендинги)
DROP POLICY IF EXISTS "Allow public read access active landings" ON landing_pages;
CREATE POLICY "Allow public read access active landings" ON landing_pages
    FOR SELECT USING (is_active = true);

-- Политика для чтения всех лендингов (админы)
DROP POLICY IF EXISTS "Allow admin read all landings" ON landing_pages;
CREATE POLICY "Allow admin read all landings" ON landing_pages
    FOR SELECT USING (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.role() = 'service_role' OR 
        (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
    );

-- Политика для вставки (только админы)
DROP POLICY IF EXISTS "Allow admin insert landings" ON landing_pages;
CREATE POLICY "Allow admin insert landings" ON landing_pages
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.role() = 'service_role' OR 
        (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
    );

-- Политика для обновления (только админы)
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

-- Политика для удаления (только админы)
DROP POLICY IF EXISTS "Allow admin delete landings" ON landing_pages;
CREATE POLICY "Allow admin delete landings" ON landing_pages
    FOR DELETE USING (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.role() = 'service_role' OR 
        (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
    );

