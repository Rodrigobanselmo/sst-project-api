-- CreateEnum
CREATE TYPE "PcmsoAcgihBeiComparisonDecisionEnum" AS ENUM ('FALSE_DIVERGENCE_EQUIVALENT', 'REAL_DIVERGENCE', 'SOURCE_ACGIH_ERROR', 'SOURCE_NR7_ERROR', 'NEEDS_FURTHER_REVIEW', 'IGNORE_MONITOR');

-- CreateTable
CREATE TABLE "PcmsoAcgihBeiComparisonReview" (
    "id" TEXT NOT NULL,
    "acgihBeiIndicatorId" TEXT NOT NULL,
    "nr7IndicatorId" TEXT,
    "examRiskRuleId" TEXT,
    "comparisonStatusSnapshot" TEXT NOT NULL,
    "suggestedActionSnapshot" TEXT,
    "decision" "PcmsoAcgihBeiComparisonDecisionEnum" NOT NULL,
    "technicalNote" TEXT NOT NULL,
    "reviewedById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PcmsoAcgihBeiComparisonReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PcmsoAcgihBeiComparisonReview_decision_idx" ON "PcmsoAcgihBeiComparisonReview"("decision");

-- CreateIndex
CREATE INDEX "PcmsoAcgihBeiComparisonReview_acgihBeiIndicatorId_idx" ON "PcmsoAcgihBeiComparisonReview"("acgihBeiIndicatorId");

-- CreateIndex
CREATE UNIQUE INDEX "PcmsoAcgihBeiComparisonReview_acgihBeiIndicatorId_key" ON "PcmsoAcgihBeiComparisonReview"("acgihBeiIndicatorId");

-- AddForeignKey
ALTER TABLE "PcmsoAcgihBeiComparisonReview" ADD CONSTRAINT "PcmsoAcgihBeiComparisonReview_acgihBeiIndicatorId_fkey" FOREIGN KEY ("acgihBeiIndicatorId") REFERENCES "PcmsoAcgihBeiIndicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PcmsoAcgihBeiComparisonReview" ADD CONSTRAINT "PcmsoAcgihBeiComparisonReview_nr7IndicatorId_fkey" FOREIGN KEY ("nr7IndicatorId") REFERENCES "OccupationalBiologicalIndicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PcmsoAcgihBeiComparisonReview" ADD CONSTRAINT "PcmsoAcgihBeiComparisonReview_examRiskRuleId_fkey" FOREIGN KEY ("examRiskRuleId") REFERENCES "PcmsoExamRiskRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
