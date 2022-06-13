-- DropForeignKey
ALTER TABLE "GenerateSource" DROP CONSTRAINT "GenerateSource_riskId_companyId_fkey";

-- DropForeignKey
ALTER TABLE "RecMed" DROP CONSTRAINT "RecMed_generateSourceId_companyId_fkey";

-- DropForeignKey
ALTER TABLE "RecMed" DROP CONSTRAINT "RecMed_riskId_companyId_fkey";

-- AlterTable
ALTER TABLE "GenerateSource" ALTER COLUMN "system" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "GenerateSource" ADD CONSTRAINT "GenerateSource_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_generateSourceId_fkey" FOREIGN KEY ("generateSourceId") REFERENCES "GenerateSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
