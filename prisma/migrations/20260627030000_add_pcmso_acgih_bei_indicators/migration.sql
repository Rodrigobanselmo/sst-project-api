-- CreateEnum
CREATE TYPE "PcmsoAcgihBeiIndicatorStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "PcmsoAcgihBeiIndicatorSourceEnum" AS ENUM ('ACGIH_BEI', 'SIMPLE_SST', 'TECHNICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "PcmsoAcgihBeiIndicatorConfidenceEnum" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "PcmsoAcgihBeiIndicator" (
    "id" TEXT NOT NULL,
    "substanceName" TEXT NOT NULL,
    "substanceNameNormalized" TEXT NOT NULL,
    "cas" TEXT,
    "referenceYear" INTEGER,
    "determinant" TEXT,
    "biologicalMatrix" TEXT,
    "samplingTime" TEXT,
    "beiValue" TEXT,
    "unit" TEXT,
    "notation" TEXT,
    "status" "PcmsoAcgihBeiIndicatorStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "source" "PcmsoAcgihBeiIndicatorSourceEnum" NOT NULL DEFAULT 'ACGIH_BEI',
    "sourceYear" INTEGER,
    "isCurated" BOOLEAN NOT NULL DEFAULT false,
    "confidence" "PcmsoAcgihBeiIndicatorConfidenceEnum",
    "internalNotes" TEXT,
    "sourcePage" TEXT,
    "dedupeKey" TEXT NOT NULL,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PcmsoAcgihBeiIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PcmsoAcgihBeiIndicator_status_idx" ON "PcmsoAcgihBeiIndicator"("status");

-- CreateIndex
CREATE INDEX "PcmsoAcgihBeiIndicator_confidence_idx" ON "PcmsoAcgihBeiIndicator"("confidence");

-- CreateIndex
CREATE INDEX "PcmsoAcgihBeiIndicator_source_idx" ON "PcmsoAcgihBeiIndicator"("source");

-- CreateIndex
CREATE INDEX "PcmsoAcgihBeiIndicator_substanceNameNormalized_idx" ON "PcmsoAcgihBeiIndicator"("substanceNameNormalized");

-- CreateIndex
CREATE INDEX "PcmsoAcgihBeiIndicator_cas_idx" ON "PcmsoAcgihBeiIndicator"("cas");

-- CreateIndex
CREATE UNIQUE INDEX "PcmsoAcgihBeiIndicator_dedupeKey_key" ON "PcmsoAcgihBeiIndicator"("dedupeKey");

