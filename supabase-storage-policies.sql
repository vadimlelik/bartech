-- Политики для bucket 'images' в Supabase Storage
-- Выполните этот SQL в Supabase Dashboard → SQL Editor

-- 1. Политика для чтения (SELECT) - публичный доступ
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- 2. Политика для загрузки (INSERT) - публичный доступ
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

-- 3. Политика для обновления (UPDATE) - если нужно редактировать файлы
CREATE POLICY "Allow public updates"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- 4. Политика для удаления (DELETE) - если нужно удалять файлы
CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'images');

