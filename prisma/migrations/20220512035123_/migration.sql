-- AlterTable
ALTER TABLE "RiskFactorGroupData" ADD COLUMN     "aprovedBy" TEXT,
ADD COLUMN     "documentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "elaboratedBy" TEXT,
ADD COLUMN     "revisionBy" TEXT,
ADD COLUMN     "source" TEXT;
