-- CreateEnum
CREATE TYPE "PcmsoExamRiskRuleReferenceSourceEnum" AS ENUM ('ACGIH_BEI', 'NR_07', 'SIMPLE_SST', 'TECHNICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "PcmsoExamRiskRuleReferenceStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "PcmsoExamRiskRuleReference" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "sourceType" "PcmsoExamRiskRuleReferenceSourceEnum" NOT NULL,
    "acgihBeiIndicatorId" TEXT,
    "nr7IndicatorId" TEXT,
    "referenceLabel" TEXT,
    "referenceYear" INTEGER,
    "description" TEXT,
    "notes" TEXT,
    "status" "PcmsoExamRiskRuleReferenceStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PcmsoExamRiskRuleReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRuleReference_ruleId_idx" ON "PcmsoExamRiskRuleReference"("ruleId");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRuleReference_sourceType_idx" ON "PcmsoExamRiskRuleReference"("sourceType");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRuleReference_acgihBeiIndicatorId_idx" ON "PcmsoExamRiskRuleReference"("acgihBeiIndicatorId");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRuleReference_nr7IndicatorId_idx" ON "PcmsoExamRiskRuleReference"("nr7IndicatorId");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRuleReference_status_idx" ON "PcmsoExamRiskRuleReference"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PcmsoExamRiskRuleReference_ruleId_acgihBeiIndicatorId_key" ON "PcmsoExamRiskRuleReference"("ruleId", "acgihBeiIndicatorId");

-- CreateIndex
CREATE UNIQUE INDEX "PcmsoExamRiskRuleReference_ruleId_nr7IndicatorId_key" ON "PcmsoExamRiskRuleReference"("ruleId", "nr7IndicatorId");

-- AddForeignKey
ALTER TABLE "PcmsoExamRiskRuleReference" ADD CONSTRAINT "PcmsoExamRiskRuleReference_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "PcmsoExamRiskRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PcmsoExamRiskRuleReference" ADD CONSTRAINT "PcmsoExamRiskRuleReference_acgihBeiIndicatorId_fkey" FOREIGN KEY ("acgihBeiIndicatorId") REFERENCES "PcmsoAcgihBeiIndicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PcmsoExamRiskRuleReference" ADD CONSTRAINT "PcmsoExamRiskRuleReference_nr7IndicatorId_fkey" FOREIGN KEY ("nr7IndicatorId") REFERENCES "OccupationalBiologicalIndicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
