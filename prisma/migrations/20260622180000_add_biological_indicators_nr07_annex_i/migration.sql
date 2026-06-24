-- CreateEnum
CREATE TYPE "BiologicalNormativeSourceEnum" AS ENUM ('NR_07');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorAnnexEnum" AS ENUM ('ANNEX_I');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorTableEnum" AS ENUM ('QUADRO_1', 'QUADRO_2');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorTypeEnum" AS ENUM ('IBE_EE', 'IBE_SC');

-- CreateEnum
CREATE TYPE "BiologicalCollectionMomentEnum" AS ENUM ('AJ', 'FJ', 'FJFS', 'AJFS', 'AJ48', 'NC', 'FS', 'AJ_FJ');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED', 'REVOKED');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorDataOriginEnum" AS ENUM ('SPREADSHEET_IMPORT', 'MANUAL', 'AI_REVIEW', 'NORMATIVE_UPDATE');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorMatchConfidenceEnum" AS ENUM ('HIGH', 'PROBABLE', 'LOW', 'MANUAL', 'NONE');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorMatchMethodEnum" AS ENUM ('CAS_EXACT', 'CAS_MULTI_ANY', 'NAME_EXACT', 'SYNONYM_EXACT', 'NAME_FUZZY', 'GROUP_RULE', 'GROUP_EXPAND', 'CATALOG_EQUIVALENCE', 'AI_SUGGESTED', 'MANUAL');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorSubstanceGroupTypeEnum" AS ENUM ('METHEMOGLOBIN_INDUCTORS', 'CHOLINESTERASE_INHIBITORS', 'INORGANIC_FLUORIDES', 'COMPOUND_FAMILY', 'ISOMER_MIXTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "BiologicalIndicatorTechnicalObservationEnum" AS ENUM ('NE', 'EPNE', 'NF', 'H', 'SH');

-- CreateEnum
CREATE TYPE "BiologicalNormativeApplicationSourceEnum" AS ENUM ('NR_07_ANNEX_I', 'MANUAL', 'MIXED');

-- CreateTable
CREATE TABLE "BiologicalIndicatorImportBatch" (
    "id" TEXT NOT NULL,
    "normativeSource" "BiologicalNormativeSourceEnum" NOT NULL,
    "normativeVersion" TEXT NOT NULL,
    "sourceFileName" TEXT,
    "sourceFileHash" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importedById" INTEGER,
    "notes" TEXT,
    "stats" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BiologicalIndicatorImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiologicalIndicatorSubstanceGroup" (
    "id" TEXT NOT NULL,
    "groupType" "BiologicalIndicatorSubstanceGroupTypeEnum" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "matchRules" JSONB,
    "status" "BiologicalIndicatorStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BiologicalIndicatorSubstanceGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OccupationalBiologicalIndicator" (
    "id" TEXT NOT NULL,
    "normativeSource" "BiologicalNormativeSourceEnum" NOT NULL,
    "annex" "BiologicalIndicatorAnnexEnum" NOT NULL,
    "tableNumber" "BiologicalIndicatorTableEnum" NOT NULL,
    "indicatorType" "BiologicalIndicatorTypeEnum" NOT NULL,
    "normativeVersion" TEXT NOT NULL,
    "substanceName" TEXT NOT NULL,
    "substanceNameNormalized" TEXT NOT NULL,
    "casPrimary" TEXT,
    "casNumbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "substanceGroupId" TEXT,
    "isSubstanceGroup" BOOLEAN NOT NULL DEFAULT false,
    "biologicalIndicatorOriginal" TEXT NOT NULL,
    "biologicalIndicatorNormalized" TEXT NOT NULL,
    "biologicalMatrix" TEXT NOT NULL,
    "collectionMoment" "BiologicalCollectionMomentEnum" NOT NULL,
    "referenceValue" TEXT,
    "referenceValueRaw" TEXT,
    "unit" TEXT,
    "technicalObservations" "BiologicalIndicatorTechnicalObservationEnum"[] DEFAULT ARRAY[]::"BiologicalIndicatorTechnicalObservationEnum"[],
    "technicalObservationsRaw" TEXT,
    "defaultValidityMonths" INTEGER NOT NULL DEFAULT 6,
    "collectionToleranceDays" INTEGER NOT NULL DEFAULT 45,
    "occupationalApplicability" JSONB NOT NULL,
    "requiresNormativeReview" BOOLEAN NOT NULL DEFAULT false,
    "generalApplicabilityNotes" TEXT,
    "status" "BiologicalIndicatorStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "dataOrigin" "BiologicalIndicatorDataOriginEnum" NOT NULL,
    "importBatchId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "supersededById" TEXT,
    "reviewedById" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "OccupationalBiologicalIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiologicalIndicatorToRisk" (
    "id" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "riskFactorId" TEXT NOT NULL,
    "matchConfidence" "BiologicalIndicatorMatchConfidenceEnum" NOT NULL,
    "matchMethod" "BiologicalIndicatorMatchMethodEnum" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "requiresReview" BOOLEAN NOT NULL DEFAULT true,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedById" INTEGER,
    "confirmedAt" TIMESTAMP(3),
    "notes" TEXT,
    "riskNameSnapshot" TEXT,
    "riskCasSnapshot" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BiologicalIndicatorToRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiologicalIndicatorToExam" (
    "id" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "examId" INTEGER NOT NULL,
    "matchConfidence" "BiologicalIndicatorMatchConfidenceEnum" NOT NULL,
    "matchMethod" "BiologicalIndicatorMatchMethodEnum" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "requiresReview" BOOLEAN NOT NULL DEFAULT true,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedById" INTEGER,
    "confirmedAt" TIMESTAMP(3),
    "notes" TEXT,
    "examNameSnapshot" TEXT,
    "examMaterialSnapshot" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BiologicalIndicatorToExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BiologicalIndicatorImportBatch_normativeSource_normativeVers_idx" ON "BiologicalIndicatorImportBatch"("normativeSource", "normativeVersion");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorImportBatch_sourceFileHash_idx" ON "BiologicalIndicatorImportBatch"("sourceFileHash");

-- CreateIndex
CREATE UNIQUE INDEX "BiologicalIndicatorSubstanceGroup_groupType_name_key" ON "BiologicalIndicatorSubstanceGroup"("groupType", "name");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorSubstanceGroup_status_idx" ON "BiologicalIndicatorSubstanceGroup"("status");

-- CreateIndex
CREATE UNIQUE INDEX "OccupationalBiologicalIndicator_idempotencyKey_key" ON "OccupationalBiologicalIndicator"("idempotencyKey");

-- CreateIndex
CREATE INDEX "OccupationalBiologicalIndicator_normativeSource_annex_tableN_idx" ON "OccupationalBiologicalIndicator"("normativeSource", "annex", "tableNumber", "indicatorType");

-- CreateIndex
CREATE INDEX "OccupationalBiologicalIndicator_substanceNameNormalized_idx" ON "OccupationalBiologicalIndicator"("substanceNameNormalized");

-- CreateIndex
CREATE INDEX "OccupationalBiologicalIndicator_casPrimary_idx" ON "OccupationalBiologicalIndicator"("casPrimary");

-- CreateIndex
CREATE INDEX "OccupationalBiologicalIndicator_biologicalIndicatorNormalize_idx" ON "OccupationalBiologicalIndicator"("biologicalIndicatorNormalized");

-- CreateIndex
CREATE INDEX "OccupationalBiologicalIndicator_status_idx" ON "OccupationalBiologicalIndicator"("status");

-- CreateIndex
CREATE INDEX "OccupationalBiologicalIndicator_normativeVersion_idx" ON "OccupationalBiologicalIndicator"("normativeVersion");

-- CreateIndex
CREATE INDEX "OccupationalBiologicalIndicator_substanceGroupId_idx" ON "OccupationalBiologicalIndicator"("substanceGroupId");

-- CreateIndex
CREATE INDEX "OccupationalBiologicalIndicator_requiresNormativeReview_idx" ON "OccupationalBiologicalIndicator"("requiresNormativeReview");

-- CreateIndex
CREATE UNIQUE INDEX "BiologicalIndicatorToRisk_indicatorId_riskFactorId_key" ON "BiologicalIndicatorToRisk"("indicatorId", "riskFactorId");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorToRisk_riskFactorId_idx" ON "BiologicalIndicatorToRisk"("riskFactorId");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorToRisk_matchConfidence_idx" ON "BiologicalIndicatorToRisk"("matchConfidence");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorToRisk_isConfirmed_idx" ON "BiologicalIndicatorToRisk"("isConfirmed");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorToRisk_isPrimary_idx" ON "BiologicalIndicatorToRisk"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "BiologicalIndicatorToExam_indicatorId_examId_key" ON "BiologicalIndicatorToExam"("indicatorId", "examId");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorToExam_examId_idx" ON "BiologicalIndicatorToExam"("examId");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorToExam_isDefault_idx" ON "BiologicalIndicatorToExam"("isDefault");

-- CreateIndex
CREATE INDEX "BiologicalIndicatorToExam_isConfirmed_idx" ON "BiologicalIndicatorToExam"("isConfirmed");

-- AddForeignKey
ALTER TABLE "BiologicalIndicatorImportBatch" ADD CONSTRAINT "BiologicalIndicatorImportBatch_importedById_fkey" FOREIGN KEY ("importedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupationalBiologicalIndicator" ADD CONSTRAINT "OccupationalBiologicalIndicator_substanceGroupId_fkey" FOREIGN KEY ("substanceGroupId") REFERENCES "BiologicalIndicatorSubstanceGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupationalBiologicalIndicator" ADD CONSTRAINT "OccupationalBiologicalIndicator_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "BiologicalIndicatorImportBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupationalBiologicalIndicator" ADD CONSTRAINT "OccupationalBiologicalIndicator_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "OccupationalBiologicalIndicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupationalBiologicalIndicator" ADD CONSTRAINT "OccupationalBiologicalIndicator_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologicalIndicatorToRisk" ADD CONSTRAINT "BiologicalIndicatorToRisk_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "OccupationalBiologicalIndicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologicalIndicatorToRisk" ADD CONSTRAINT "BiologicalIndicatorToRisk_riskFactorId_fkey" FOREIGN KEY ("riskFactorId") REFERENCES "RiskFactors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologicalIndicatorToRisk" ADD CONSTRAINT "BiologicalIndicatorToRisk_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologicalIndicatorToExam" ADD CONSTRAINT "BiologicalIndicatorToExam_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "OccupationalBiologicalIndicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologicalIndicatorToExam" ADD CONSTRAINT "BiologicalIndicatorToExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologicalIndicatorToExam" ADD CONSTRAINT "BiologicalIndicatorToExam_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
