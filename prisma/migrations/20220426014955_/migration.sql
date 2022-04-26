/*
  Warnings:

  - You are about to drop the `AdmMeasures` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MesuresTypeEnum" AS ENUM ('ADM', 'ENG');

-- DropForeignKey
ALTER TABLE "AdmMeasures" DROP CONSTRAINT "AdmMeasures_companyId_fkey";

-- DropForeignKey
ALTER TABLE "AdmMeasures" DROP CONSTRAINT "AdmMeasures_generateSourceId_companyId_fkey";

-- DropForeignKey
ALTER TABLE "AdmMeasures" DROP CONSTRAINT "AdmMeasures_riskId_companyId_fkey";

-- AlterTable
ALTER TABLE "HomogeneousGroup" ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RecMed" ADD COLUMN     "medType" "MesuresTypeEnum" DEFAULT E'ENG';

-- DropTable
DROP TABLE "AdmMeasures";
