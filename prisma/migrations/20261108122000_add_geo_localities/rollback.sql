-- Откат справочника населённых пунктов. Таблица cities и пользователи не затрагиваются.
-- Расширение pg_trgm не удаляется: оно могло стоять в базе до этой миграции.

DROP TRIGGER IF EXISTS localities_sync_name_norm ON localities;
DROP FUNCTION IF EXISTS localities_sync_name_norm();

DROP TABLE IF EXISTS "localities";
DROP TABLE IF EXISTS "geo_districts";
DROP TABLE IF EXISTS "geo_regions";
