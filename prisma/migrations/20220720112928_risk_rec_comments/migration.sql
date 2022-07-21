/*
  Warnings:

  - You are about to drop the column `comment` on the `RiskFactorDataRec` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RiskRecTypeEnum" AS ENUM ('CANCELED', 'POSTPONED', 'DONE');

-- AlterTable
ALTER TABLE "RiskFactorDataRec" DROP COLUMN "comment";

-- CreateTable
CREATE TABLE "RiskFactorDataRecComments" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "RiskRecTypeEnum" NOT NULL,
    "riskFactorDataRecId" TEXT NOT NULL,

    CONSTRAINT "RiskFactorDataRecComments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RiskFactorDataRecComments" ADD CONSTRAINT "RiskFactorDataRecComments_riskFactorDataRecId_fkey" FOREIGN KEY ("riskFactorDataRecId") REFERENCES "RiskFactorDataRec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
