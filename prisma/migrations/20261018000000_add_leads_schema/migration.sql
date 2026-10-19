-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "leads";

-- CreateTable
CREATE TABLE "leads"."form_submissions" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "page_path" TEXT,
    "title" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_submissions_created_at_idx" ON "leads"."form_submissions"("created_at");

-- CreateIndex
CREATE INDEX "form_submissions_phone_idx" ON "leads"."form_submissions"("phone");

-- CreateIndex
CREATE INDEX "form_submissions_source_idx" ON "leads"."form_submissions"("source");
