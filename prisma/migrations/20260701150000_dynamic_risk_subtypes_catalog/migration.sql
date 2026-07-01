-- Catálogo curável de subtipos de risco (RiskSubType).
-- Aditiva: preserva sub_type legado nos 7 registros existentes.

ALTER TABLE "RiskSubType" ADD COLUMN "slug" TEXT;
ALTER TABLE "RiskSubType" ADD COLUMN "description" TEXT;
ALTER TABLE "RiskSubType" ADD COLUMN "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "RiskSubType" ADD COLUMN "system" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "RiskSubType" ADD COLUMN "createdById" INTEGER;

ALTER TABLE "RiskSubType" ALTER COLUMN "sub_type" DROP NOT NULL;
ALTER TABLE "RiskSubType" ALTER COLUMN "sub_type" DROP DEFAULT;

UPDATE "RiskSubType"
SET
  "system" = true,
  "status" = 'ACTIVE',
  "slug" = CASE "name"
    WHEN 'Psicossociais' THEN 'psicossociais'
    WHEN 'Ambientais' THEN 'ambientais'
    WHEN 'Biomecânicos' THEN 'biomecanicos'
    WHEN 'Mobiliário e Equipamentos' THEN 'mobiliario-e-equipamentos'
    WHEN 'Organizacionais' THEN 'organizacionais'
    WHEN 'Indicadores de Saúde' THEN 'indicadores-de-saude'
    WHEN 'Indicadores de Controles' THEN 'indicadores-de-controles'
    ELSE lower(regexp_replace(regexp_replace(trim("name"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
  END
WHERE "slug" IS NULL;

ALTER TABLE "RiskSubType" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "RiskSubType_type_slug_key" ON "RiskSubType"("type", "slug");
CREATE INDEX "RiskSubType_type_status_idx" ON "RiskSubType"("type", "status");
