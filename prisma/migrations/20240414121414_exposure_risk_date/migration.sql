-- DropForeignKey
ALTER TABLE "CompanyCharacterizationFile" DROP CONSTRAINT "CompanyCharacterizationFile_companyCharacterizationId_fkey";

-- AlterTable
ALTER TABLE "RiskFactorData" ADD COLUMN     "exposure" INTEGER;

-- AddForeignKey
ALTER TABLE "CompanyCharacterizationFile" ADD CONSTRAINT "CompanyCharacterizationFile_companyCharacterizationId_fkey" FOREIGN KEY ("companyCharacterizationId") REFERENCES "CompanyCharacterization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
