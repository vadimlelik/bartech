-- Создание таблицы landing_pages в Supabase
-- Выполните этот SQL в SQL Editor в Supabase Dashboard

CREATE TABLE IF NOT EXISTS landing_pages (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL CHECK (theme IN ('phone2', 'phone3', 'phone4')),
  content JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  pixels JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_theme ON landing_pages(theme);
CREATE INDEX IF NOT EXISTS idx_landing_pages_is_active ON landing_pages(is_active);

-- Создание триггера для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_landing_pages_updated_at ON landing_pages;
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Включение Row Level Security
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- Политика для чтения (все могут читать активные страницы)
DROP POLICY IF EXISTS "Allow public read access landing pages" ON landing_pages;
CREATE POLICY "Allow public read access landing pages" ON landing_pages
    FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

-- Политика для вставки (только админы)
DROP POLICY IF EXISTS "Allow admin insert landing pages" ON landing_pages;
CREATE POLICY "Allow admin insert landing pages" ON landing_pages
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Политика для обновления (только админы)
DROP POLICY IF EXISTS "Allow admin update landing pages" ON landing_pages;
CREATE POLICY "Allow admin update landing pages" ON landing_pages
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- Политика для удаления (только админы)
DROP POLICY IF EXISTS "Allow admin delete landing pages" ON landing_pages;
CREATE POLICY "Allow admin delete landing pages" ON landing_pages
    FOR DELETE USING (public.is_admin(auth.uid()));
