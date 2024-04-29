/*
  Warnings:

  - The `exposure` column on the `RiskFactorData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ExposureTypeEnum" AS ENUM ('HP', 'O', 'HI');

-- AlterTable
ALTER TABLE "RiskFactorData" DROP COLUMN "exposure",
ADD COLUMN     "exposure" "ExposureTypeEnum";
