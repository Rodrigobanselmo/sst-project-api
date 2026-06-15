-- CreateEnum
CREATE TYPE "HoMethodSourceEnum" AS ENUM ('NIOSH', 'OSHA', 'FUNDACENTRO', 'ACGIH', 'AIHA', 'ISO', 'INTERNAL', 'OTHER');

-- CreateEnum
CREATE TYPE "HoMethodAgentTypeEnum" AS ENUM ('CHEMICAL', 'PHYSICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "HoMethodEvaluationTypeEnum" AS ENUM ('TWA', 'STEL', 'CEILING', 'QUALITATIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "HoMethodAvailabilityStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_CONSULTATION', 'NOT_AVAILABLE');

-- CreateEnum
CREATE TYPE "HoMethodLaboratoryAvailabilityStatusEnum" AS ENUM ('AVAILABLE', 'NOT_AVAILABLE', 'UNDER_CONSULTATION', 'UNKNOWN');

-- CreateTable
CREATE TABLE "HoMethod" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "agentName" TEXT,
    "cas" TEXT,
    "riskFactorId" TEXT,
    "institution" "HoMethodSourceEnum" NOT NULL,
    "methodCode" TEXT NOT NULL,
    "methodVersion" TEXT,
    "analyticalMethod" TEXT,
    "agentType" "HoMethodAgentTypeEnum" NOT NULL DEFAULT 'CHEMICAL',
    "evaluationType" "HoMethodEvaluationTypeEnum",
    "prioritized" BOOLEAN NOT NULL DEFAULT false,
    "status" "HoMethodAvailabilityStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "sampler" TEXT,
    "minimumFlowRate" DECIMAL(12,4),
    "maximumFlowRate" DECIMAL(12,4),
    "minimumVolume" DECIMAL(12,4),
    "maximumVolume" DECIMAL(12,4),
    "flowRateUnit" TEXT,
    "volumeUnit" TEXT,
    "storageTemperature" DECIMAL(8,2),
    "storageTemperatureUnit" TEXT,
    "stabilityDays" INTEGER,
    "extractionSolvent" TEXT,
    "nr15Limit" DECIMAL(12,4),
    "acgihTwa" DECIMAL(12,4),
    "acgihStel" DECIMAL(12,4),
    "ceilingLimit" DECIMAL(12,4),
    "limitUnit" TEXT,
    "laboratoryName" TEXT,
    "laboratoryAvailabilityStatus" "HoMethodLaboratoryAvailabilityStatusEnum",
    "laboratoryNotes" TEXT,
    "lastLaboratoryConfirmationDate" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "HoMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HoMethod_agentName_idx" ON "HoMethod"("agentName");

-- CreateIndex
CREATE INDEX "HoMethod_cas_idx" ON "HoMethod"("cas");

-- CreateIndex
CREATE INDEX "HoMethod_institution_idx" ON "HoMethod"("institution");

-- CreateIndex
CREATE INDEX "HoMethod_methodCode_idx" ON "HoMethod"("methodCode");

-- CreateIndex
CREATE INDEX "HoMethod_status_idx" ON "HoMethod"("status");

-- CreateIndex
CREATE INDEX "HoMethod_prioritized_idx" ON "HoMethod"("prioritized");

-- CreateIndex
CREATE INDEX "HoMethod_evaluationType_idx" ON "HoMethod"("evaluationType");
