/*
  Warnings:

  - Added the required column `textType` to the `RiskFactorDataRecComments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RiskRecTextTypeEnum" AS ENUM ('MONEY', 'TECHNIQUE', 'LOGISTICS', 'OTHER');

-- AlterTable
ALTER TABLE "RiskFactorDataRecComments" ADD COLUMN     "textType" "RiskRecTextTypeEnum" NOT NULL;
