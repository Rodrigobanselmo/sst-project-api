-- Extend evaluation types for HO methods
ALTER TYPE "HoMethodEvaluationTypeEnum" ADD VALUE IF NOT EXISTS 'CMPT';
ALTER TYPE "HoMethodEvaluationTypeEnum" ADD VALUE IF NOT EXISTS 'VMP';

-- CreateTable
CREATE TABLE "HoSampler" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "HoSampler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoExtractionSolvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "synonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "HoExtractionSolvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoMethodEvaluationCondition" (
    "id" TEXT NOT NULL,
    "hoMethodId" TEXT NOT NULL,
    "evaluationType" "HoMethodEvaluationTypeEnum" NOT NULL,
    "limitValue" TEXT,
    "limitUnit" TEXT,
    "minimumFlowRate" DECIMAL(12,4),
    "maximumFlowRate" DECIMAL(12,4),
    "minimumVolume" DECIMAL(12,4),
    "maximumVolume" DECIMAL(12,4),
    "flowRateUnit" TEXT,
    "volumeUnit" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HoMethodEvaluationCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoMethodLaboratory" (
    "id" TEXT NOT NULL,
    "hoMethodId" TEXT NOT NULL,
    "laboratoryName" TEXT NOT NULL,
    "availabilityStatus" "HoMethodLaboratoryAvailabilityStatusEnum" NOT NULL DEFAULT 'UNKNOWN',
    "lastConfirmationDate" TIMESTAMP(3),
    "notes" TEXT,
    "analyticalNotes" TEXT,
    "samplerId" TEXT,
    "extractionSolventId" TEXT,
    "minimumFlowRateOverride" DECIMAL(12,4),
    "maximumFlowRateOverride" DECIMAL(12,4),
    "minimumVolumeOverride" DECIMAL(12,4),
    "maximumVolumeOverride" DECIMAL(12,4),
    "storageTemperatureOverride" DECIMAL(8,2),
    "stabilityDaysOverride" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "HoMethodLaboratory_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "HoMethod"
ADD COLUMN "samplerId" TEXT,
ADD COLUMN "extractionSolventId" TEXT,
ADD COLUMN "originalDocumentFileId" TEXT,
ADD COLUMN "originalDocumentName" TEXT,
ADD COLUMN "originalDocumentUploadedAt" TIMESTAMP(3);

-- Migrate legacy flat data into child tables before dropping columns
INSERT INTO "HoMethodEvaluationCondition" (
    "id",
    "hoMethodId",
    "evaluationType",
    "limitValue",
    "limitUnit",
    "minimumFlowRate",
    "maximumFlowRate",
    "minimumVolume",
    "maximumVolume",
    "flowRateUnit",
    "volumeUnit",
    "updated_at"
)
SELECT
    md5(random()::text || clock_timestamp()::text || hm."id")::uuid::text,
    hm."id",
    hm."evaluationType",
    COALESCE(hm."nr15Limit"::text, hm."acgihTwa"::text, hm."acgihStel"::text, hm."ceilingLimit"::text),
    hm."limitUnit",
    hm."minimumFlowRate",
    hm."maximumFlowRate",
    hm."minimumVolume",
    hm."maximumVolume",
    hm."flowRateUnit",
    hm."volumeUnit",
    CURRENT_TIMESTAMP
FROM "HoMethod" hm
WHERE hm."evaluationType" IS NOT NULL
  AND hm."deleted_at" IS NULL;

INSERT INTO "HoMethodLaboratory" (
    "id",
    "hoMethodId",
    "laboratoryName",
    "availabilityStatus",
    "lastConfirmationDate",
    "notes",
    "updated_at"
)
SELECT
    md5(random()::text || clock_timestamp()::text || hm."id" || 'lab')::uuid::text,
    hm."id",
    hm."laboratoryName",
    COALESCE(hm."laboratoryAvailabilityStatus", 'UNKNOWN'),
    hm."lastLaboratoryConfirmationDate",
    hm."laboratoryNotes",
    CURRENT_TIMESTAMP
FROM "HoMethod" hm
WHERE hm."laboratoryName" IS NOT NULL
  AND btrim(hm."laboratoryName") <> ''
  AND hm."deleted_at" IS NULL;

-- Drop legacy columns
ALTER TABLE "HoMethod"
DROP COLUMN IF EXISTS "evaluationType",
DROP COLUMN IF EXISTS "sampler",
DROP COLUMN IF EXISTS "extractionSolvent",
DROP COLUMN IF EXISTS "nr15Limit",
DROP COLUMN IF EXISTS "acgihTwa",
DROP COLUMN IF EXISTS "acgihStel",
DROP COLUMN IF EXISTS "ceilingLimit",
DROP COLUMN IF EXISTS "limitUnit",
DROP COLUMN IF EXISTS "laboratoryName",
DROP COLUMN IF EXISTS "laboratoryAvailabilityStatus",
DROP COLUMN IF EXISTS "laboratoryNotes",
DROP COLUMN IF EXISTS "lastLaboratoryConfirmationDate";

-- DropIndex
DROP INDEX IF EXISTS "HoMethod_evaluationType_idx";

-- CreateIndex
CREATE UNIQUE INDEX "HoSampler_name_key" ON "HoSampler"("name");
CREATE INDEX "HoSampler_active_idx" ON "HoSampler"("active");

CREATE UNIQUE INDEX "HoExtractionSolvent_name_key" ON "HoExtractionSolvent"("name");
CREATE INDEX "HoExtractionSolvent_active_idx" ON "HoExtractionSolvent"("active");

CREATE INDEX "HoMethodEvaluationCondition_evaluationType_idx" ON "HoMethodEvaluationCondition"("evaluationType");
CREATE UNIQUE INDEX "HoMethodEvaluationCondition_hoMethodId_evaluationType_key" ON "HoMethodEvaluationCondition"("hoMethodId", "evaluationType");

CREATE INDEX "HoMethodLaboratory_hoMethodId_idx" ON "HoMethodLaboratory"("hoMethodId");
CREATE INDEX "HoMethodLaboratory_availabilityStatus_idx" ON "HoMethodLaboratory"("availabilityStatus");

CREATE INDEX "HoMethod_riskFactorId_idx" ON "HoMethod"("riskFactorId");

-- AddForeignKey
ALTER TABLE "HoMethod" ADD CONSTRAINT "HoMethod_riskFactorId_fkey" FOREIGN KEY ("riskFactorId") REFERENCES "RiskFactors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "HoMethod" ADD CONSTRAINT "HoMethod_samplerId_fkey" FOREIGN KEY ("samplerId") REFERENCES "HoSampler"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "HoMethod" ADD CONSTRAINT "HoMethod_extractionSolventId_fkey" FOREIGN KEY ("extractionSolventId") REFERENCES "HoExtractionSolvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "HoMethodEvaluationCondition" ADD CONSTRAINT "HoMethodEvaluationCondition_hoMethodId_fkey" FOREIGN KEY ("hoMethodId") REFERENCES "HoMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HoMethodLaboratory" ADD CONSTRAINT "HoMethodLaboratory_hoMethodId_fkey" FOREIGN KEY ("hoMethodId") REFERENCES "HoMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HoMethodLaboratory" ADD CONSTRAINT "HoMethodLaboratory_samplerId_fkey" FOREIGN KEY ("samplerId") REFERENCES "HoSampler"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "HoMethodLaboratory" ADD CONSTRAINT "HoMethodLaboratory_extractionSolventId_fkey" FOREIGN KEY ("extractionSolventId") REFERENCES "HoExtractionSolvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed default samplers
INSERT INTO "HoSampler" ("id", "name", "type", "updated_at")
VALUES
  (md5('ho-sampler-tca-100-50')::uuid::text, 'TCA-100/50', 'Tubos de carvão', CURRENT_TIMESTAMP),
  (md5('ho-sampler-tca-400-200')::uuid::text, 'TCA-400/200', 'Tubos de carvão', CURRENT_TIMESTAMP),
  (md5('ho-sampler-cassete-pvc-5')::uuid::text, 'Cassete PVC 5 µm', 'Cassete', CURRENT_TIMESTAMP),
  (md5('ho-sampler-cassete-mce-08')::uuid::text, 'Cassete MCE 0,8 µm', 'Cassete', CURRENT_TIMESTAMP),
  (md5('ho-sampler-tedlar-5l')::uuid::text, 'Balão de Tedlar 5 L', 'Balão', CURRENT_TIMESTAMP),
  (md5('ho-sampler-silica-dnph')::uuid::text, 'Tubo de sílica gel tratada com DNPH', 'Tubo', CURRENT_TIMESTAMP),
  (md5('ho-sampler-impinger')::uuid::text, 'Impinger', 'Impinger', CURRENT_TIMESTAMP),
  (md5('ho-sampler-iom')::uuid::text, 'IOM', 'Cassete', CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

-- Seed default extraction solvents
INSERT INTO "HoExtractionSolvent" ("id", "name", "synonyms", "updated_at")
VALUES
  (md5('ho-solvent-cs2')::uuid::text, 'Dissulfeto de carbono (CS2)', ARRAY['Carbon disulfide', 'CS2'], CURRENT_TIMESTAMP),
  (md5('ho-solvent-cs2-dmf')::uuid::text, 'Dissulfeto de carbono com 5% de Dimetilformamida', ARRAY['CS2/DMF'], CURRENT_TIMESTAMP),
  (md5('ho-solvent-acn-dmso')::uuid::text, 'Acetonitrila/Dimetil sulfóxido (ACN/DMSO)', ARRAY['ACN/DMSO'], CURRENT_TIMESTAMP),
  (md5('ho-solvent-water')::uuid::text, 'Água deionizada', ARRAY['Water'], CURRENT_TIMESTAMP),
  (md5('ho-solvent-formic')::uuid::text, 'Ácido fórmico', ARRAY['Formic acid'], CURRENT_TIMESTAMP),
  (md5('ho-solvent-methanol')::uuid::text, 'Metanol', ARRAY['Methanol'], CURRENT_TIMESTAMP),
  (md5('ho-solvent-acetone')::uuid::text, 'Acetona', ARRAY['Acetone'], CURRENT_TIMESTAMP),
  (md5('ho-solvent-na')::uuid::text, 'Não aplicável', ARRAY['N/A'], CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;
