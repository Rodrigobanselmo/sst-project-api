/*
  Warnings:

  - You are about to drop the column `nr16appendix` on the `RiskFactors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RiskFactors" DROP COLUMN "nr16appendix",
ADD COLUMN     "otherAppendix" TEXT;
