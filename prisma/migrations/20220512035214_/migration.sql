/*
  Warnings:

  - You are about to drop the column `aprovedBy` on the `RiskFactorGroupData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RiskFactorGroupData" DROP COLUMN "aprovedBy",
ADD COLUMN     "approvedBy" TEXT;
