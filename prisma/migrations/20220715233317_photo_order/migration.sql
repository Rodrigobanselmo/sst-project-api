-- AlterTable
ALTER TABLE "CompanyCharacterizationPhoto" ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "CompanyEnvironmentPhoto" ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "RiskFactorDocument" ALTER COLUMN "version" SET DEFAULT E'1.0.0';
