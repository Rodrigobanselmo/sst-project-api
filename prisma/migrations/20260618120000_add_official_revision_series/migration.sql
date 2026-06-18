-- AlterTable
ALTER TABLE "DocumentData" ADD COLUMN "officialRevisionSeries" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "RiskFactorDocument" ADD COLUMN "officialRevisionSeries" INTEGER;

-- Backfill: versões oficiais existentes recebem série 1
UPDATE "RiskFactorDocument"
SET "officialRevisionSeries" = 1
WHERE "version" ~ '^[1-9][0-9]*\.0\.0$';
