/*
  Warnings:

  - You are about to drop the column `task` on the `RiskFactors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RiskFactors" DROP COLUMN "task",
ADD COLUMN     "activities" JSONB,
ADD COLUMN     "nr16appendix" TEXT;
