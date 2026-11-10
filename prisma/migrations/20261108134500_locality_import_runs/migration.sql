-- Статус фонового импорта населённых пунктов из OSM.

CREATE TABLE "locality_import_runs" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "added" INTEGER NOT NULL DEFAULT 0,
    "updated" INTEGER NOT NULL DEFAULT 0,
    "unchanged" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "locality_import_runs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "locality_import_runs_status_idx" ON "locality_import_runs"("status");
