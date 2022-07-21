-- AlterTable
ALTER TABLE "RiskFactorGroupData" ADD COLUMN     "months_period_level_2" INTEGER NOT NULL DEFAULT 24,
ADD COLUMN     "months_period_level_3" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "months_period_level_4" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN     "months_period_level_5" INTEGER NOT NULL DEFAULT 3;
