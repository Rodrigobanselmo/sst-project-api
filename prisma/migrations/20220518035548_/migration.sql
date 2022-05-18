/*
  Warnings:

  - You are about to drop the column `documentDate` on the `RiskFactorGroupData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RiskFactorGroupData" DROP COLUMN "documentDate",
ADD COLUMN     "visitDate" TIMESTAMP(3);
