-- AlterTable
ALTER TABLE "RiskFactors" ADD COLUMN     "isAso" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPCMSO" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPGR" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPPP" BOOLEAN NOT NULL DEFAULT true;
