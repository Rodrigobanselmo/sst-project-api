/*
  Warnings:

  - You are about to drop the `_CompanyEnvironmentToHierarchy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompanyEnvironmentToRiskFactors` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CharacterizationTypeEnum" AS ENUM ('WORKSTATION', 'EQUIPMENT', 'ACTIVITIES');

-- CreateEnum
CREATE TYPE "RecTypeEnum" AS ENUM ('ADM', 'ENG', 'EPI');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "HomoTypeEnum" ADD VALUE 'EQUIPMENT';
ALTER TYPE "HomoTypeEnum" ADD VALUE 'ACTIVITIES';

-- DropForeignKey
ALTER TABLE "_CompanyEnvironmentToHierarchy" DROP CONSTRAINT "_CompanyEnvironmentToHierarchy_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyEnvironmentToHierarchy" DROP CONSTRAINT "_CompanyEnvironmentToHierarchy_B_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyEnvironmentToRiskFactors" DROP CONSTRAINT "_CompanyEnvironmentToRiskFactors_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyEnvironmentToRiskFactors" DROP CONSTRAINT "_CompanyEnvironmentToRiskFactors_B_fkey";

-- AlterTable
ALTER TABLE "CompanyEnvironment" ADD COLUMN     "luminosity" TEXT;

-- AlterTable
ALTER TABLE "RecMed" ADD COLUMN     "recType" "RecTypeEnum";

-- DropTable
DROP TABLE "_CompanyEnvironmentToHierarchy";

-- DropTable
DROP TABLE "_CompanyEnvironmentToRiskFactors";

-- CreateTable
CREATE TABLE "CompanyCharacterization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "CharacterizationTypeEnum" NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyCharacterization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyCharacterizationPhoto" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isVertical" BOOLEAN NOT NULL DEFAULT false,
    "photoUrl" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "companyCharacterizationId" TEXT NOT NULL,

    CONSTRAINT "CompanyCharacterizationPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyCharacterization_workspaceId_companyId_id_key" ON "CompanyCharacterization"("workspaceId", "companyId", "id");

-- CreateIndex
CREATE INDEX "HomogeneousGroup_name_idx" ON "HomogeneousGroup"("name");

-- AddForeignKey
ALTER TABLE "CompanyCharacterization" ADD CONSTRAINT "CompanyCharacterization_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCharacterization" ADD CONSTRAINT "CompanyCharacterization_id_fkey" FOREIGN KEY ("id") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCharacterization" ADD CONSTRAINT "CompanyCharacterization_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCharacterizationPhoto" ADD CONSTRAINT "CompanyCharacterizationPhoto_companyCharacterizationId_fkey" FOREIGN KEY ("companyCharacterizationId") REFERENCES "CompanyCharacterization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyEnvironment" ADD CONSTRAINT "CompanyEnvironment_id_fkey" FOREIGN KEY ("id") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
