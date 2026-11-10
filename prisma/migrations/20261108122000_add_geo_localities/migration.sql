-- Справочник населённых пунктов. Витринные города (cities) не изменяются.
-- name_norm: нижний регистр, ё→е, схлопнутые пробелы. Нужен для поиска по префиксу.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateTable
CREATE TABLE "geo_regions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "geo_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_districts" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "geo_districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localities" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_norm" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "population" INTEGER,
    "osm_id" BIGINT,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "service_city_slug" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "localities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "geo_regions_name_key" ON "geo_regions"("name");

-- CreateIndex
CREATE INDEX "geo_districts_region_id_idx" ON "geo_districts"("region_id");

-- CreateIndex
CREATE UNIQUE INDEX "geo_districts_region_id_name_key" ON "geo_districts"("region_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "localities_osm_id_key" ON "localities"("osm_id");

-- CreateIndex
CREATE INDEX "localities_district_id_idx" ON "localities"("district_id");

-- CreateIndex
CREATE INDEX "localities_service_city_slug_idx" ON "localities"("service_city_slug");

-- CreateIndex
CREATE INDEX "localities_is_active_is_popular_idx" ON "localities"("is_active", "is_popular");

-- CreateIndex
CREATE INDEX "localities_name_norm_prefix_idx" ON "localities"("name_norm" text_pattern_ops);

-- CreateIndex
CREATE INDEX "localities_name_norm_trgm_idx" ON "localities" USING GIN ("name_norm" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "localities_slug_key" ON "localities"("slug");

-- AddForeignKey
ALTER TABLE "geo_districts" ADD CONSTRAINT "geo_districts_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "geo_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localities" ADD CONSTRAINT "localities_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "geo_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localities" ADD CONSTRAINT "localities_service_city_slug_fkey" FOREIGN KEY ("service_city_slug") REFERENCES "cities"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION localities_sync_name_norm()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.name_norm := replace(
    lower(btrim(regexp_replace(NEW.name, '[[:space:]]+', ' ', 'g'))),
    'ё',
    'е'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER localities_sync_name_norm
BEFORE INSERT OR UPDATE ON localities
FOR EACH ROW
EXECUTE FUNCTION localities_sync_name_norm();
