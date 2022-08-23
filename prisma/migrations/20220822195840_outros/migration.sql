/*
  Warnings:

  - The values [OTH] on the enum `RiskFactorsEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RiskFactorsEnum_new" AS ENUM ('BIO', 'QUI', 'FIS', 'ERG', 'ACI', 'OUTROS');
ALTER TABLE "RiskFactors" ALTER COLUMN "type" TYPE "RiskFactorsEnum_new" USING ("type"::text::"RiskFactorsEnum_new");
ALTER TYPE "RiskFactorsEnum" RENAME TO "RiskFactorsEnum_old";
ALTER TYPE "RiskFactorsEnum_new" RENAME TO "RiskFactorsEnum";
DROP TYPE "RiskFactorsEnum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ExamToRiskData" DROP CONSTRAINT "ExamToRiskData_riskFactorDataId_fkey";

-- AddForeignKey
ALTER TABLE "ExamToRiskData" ADD CONSTRAINT "ExamToRiskData_riskFactorDataId_fkey" FOREIGN KEY ("riskFactorDataId") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
