/*
  Warnings:

  - The primary key for the `RecMed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RiskFactors` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "RecMed" DROP CONSTRAINT "RecMed_riskId_fkey";

-- AlterTable
ALTER TABLE "RecMed" DROP CONSTRAINT "RecMed_pkey",
ADD CONSTRAINT "RecMed_pkey" PRIMARY KEY ("id", "companyId");

-- AlterTable
ALTER TABLE "RiskFactors" DROP CONSTRAINT "RiskFactors_pkey",
ADD CONSTRAINT "RiskFactors_pkey" PRIMARY KEY ("id", "companyId");

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_riskId_companyId_fkey" FOREIGN KEY ("riskId", "companyId") REFERENCES "RiskFactors"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
