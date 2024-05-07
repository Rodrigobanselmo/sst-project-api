-- CreateEnum
CREATE TYPE "GrauInsalubridade" AS ENUM ('MIN', 'MAX', 'MED');

-- AlterTable
ALTER TABLE "RiskFactors" ADD COLUMN     "grauInsalubridade" "GrauInsalubridade";
