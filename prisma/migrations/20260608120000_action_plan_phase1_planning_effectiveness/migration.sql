-- CreateEnum
CREATE TYPE "EffectivenessStatusEnum" AS ENUM ('NOT_EVALUATED', 'EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'NOT_APPLICABLE');

-- AlterTable
ALTER TABLE "RiskFactorDataRec" ADD COLUMN     "monitoringMethod" VARCHAR(2000),
ADD COLUMN     "resultCriteria" VARCHAR(2000),
ADD COLUMN     "effectivenessStatus" "EffectivenessStatusEnum" NOT NULL DEFAULT 'NOT_EVALUATED',
ADD COLUMN     "effectivenessDate" TIMESTAMP(3),
ADD COLUMN     "effectivenessComment" VARCHAR(4000),
ADD COLUMN     "effectivenessById" INTEGER;

-- AddForeignKey
ALTER TABLE "RiskFactorDataRec" ADD CONSTRAINT "RiskFactorDataRec_effectivenessById_fkey" FOREIGN KEY ("effectivenessById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
