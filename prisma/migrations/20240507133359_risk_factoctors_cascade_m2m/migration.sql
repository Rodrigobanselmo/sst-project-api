-- DropForeignKey
ALTER TABLE "ExamToRisk" DROP CONSTRAINT "ExamToRisk_riskId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorProbability" DROP CONSTRAINT "RiskFactorProbability_riskId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorsDocInfo" DROP CONSTRAINT "RiskFactorsDocInfo_riskId_fkey";

-- AddForeignKey
ALTER TABLE "ExamToRisk" ADD CONSTRAINT "ExamToRisk_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorsDocInfo" ADD CONSTRAINT "RiskFactorsDocInfo_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorProbability" ADD CONSTRAINT "RiskFactorProbability_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
