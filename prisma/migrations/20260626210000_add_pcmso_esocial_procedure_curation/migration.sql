-- CreateEnum
CREATE TYPE "PcmsoEsocialProcedureStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "PcmsoEsocialProcedureSourceEnum" AS ENUM ('ESOCIAL_TABLE_27', 'SIMPLE_SST', 'TECHNICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "PcmsoEsocialProcedureTypeEnum" AS ENUM ('CLINICAL', 'LABORATORY', 'IMAGING', 'AUDIOMETRY', 'SPIROMETRY', 'TOXICOLOGICAL', 'OTHER');

-- CreateTable
CREATE TABLE "PcmsoEsocialProcedure" (
    "id" TEXT NOT NULL,
    "procedureCode" TEXT NOT NULL,
    "procedureNameSnapshot" TEXT,
    "status" "PcmsoEsocialProcedureStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "isOccupationalRelevant" BOOLEAN NOT NULL DEFAULT false,
    "technicalType" "PcmsoEsocialProcedureTypeEnum",
    "internalNotes" TEXT,
    "source" "PcmsoEsocialProcedureSourceEnum" NOT NULL DEFAULT 'ESOCIAL_TABLE_27',
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PcmsoEsocialProcedure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PcmsoEsocialProcedure_status_idx" ON "PcmsoEsocialProcedure"("status");

-- CreateIndex
CREATE INDEX "PcmsoEsocialProcedure_isOccupationalRelevant_idx" ON "PcmsoEsocialProcedure"("isOccupationalRelevant");

-- CreateIndex
CREATE INDEX "PcmsoEsocialProcedure_technicalType_idx" ON "PcmsoEsocialProcedure"("technicalType");

-- CreateIndex
CREATE INDEX "PcmsoEsocialProcedure_source_idx" ON "PcmsoEsocialProcedure"("source");

-- CreateIndex
CREATE UNIQUE INDEX "PcmsoEsocialProcedure_procedureCode_key" ON "PcmsoEsocialProcedure"("procedureCode");

