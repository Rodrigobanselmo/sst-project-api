/*
  Warnings:

  - You are about to drop the `EpiToRiskFactorData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EpiToRiskFactorData" DROP CONSTRAINT "EpiToRiskFactorData_epiId_fkey";

-- DropForeignKey
ALTER TABLE "EpiToRiskFactorData" DROP CONSTRAINT "EpiToRiskFactorData_riskFactorDataId_fkey";

-- DropIndex
DROP INDEX "_EpiToRiskFactorData_AB_unique";

-- DropIndex
DROP INDEX "_EpiToRiskFactorData_B_index";

-- AlterTable
ALTER TABLE "_EpiToRiskFactorData" ADD COLUMN     "efficientlyCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "epcCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lifeTimeInDays" INTEGER,
ADD COLUMN     "longPeriodsCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maintenanceCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sanitationCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tradeSignCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trainingCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unstoppedCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validationCheck" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "_EpiToRiskFactorData_pkey" PRIMARY KEY ("B", "A");

-- DropTable
DROP TABLE "EpiToRiskFactorData";
