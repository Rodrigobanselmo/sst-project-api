/*
  Warnings:

  - You are about to drop the column `pcmsoId` on the `RiskFactorDocument` table. All the data in the column will be lost.
  - You are about to drop the column `riskGroupId` on the `RiskFactorDocument` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `complementaryDocs` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `complementarySystems` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `coordinatorBy` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `elaboratedBy` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `hasEmergencyPlan` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `isQ5` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `months_period_level_2` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `months_period_level_3` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `months_period_level_4` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `months_period_level_5` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `revisionBy` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `validity` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `validityEnd` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `validityStart` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the column `visitDate` on the `RiskFactorGroupData` table. All the data in the column will be lost.
  - You are about to drop the `DocumentPCMSO` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DocumentPCMSOToProfessional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProfessionalToRiskFactorGroupData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RiskFactorGroupDataToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `documentDataId` to the `RiskFactorDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DocumentPCMSO" DROP CONSTRAINT "DocumentPCMSO_companyId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorDocument" DROP CONSTRAINT "RiskFactorDocument_pcmsoId_companyId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorDocument" DROP CONSTRAINT "RiskFactorDocument_riskGroupId_companyId_fkey";

-- DropForeignKey
ALTER TABLE "_DocumentPCMSOToProfessional" DROP CONSTRAINT "_DocumentPCMSOToProfessional_A_fkey";

-- DropForeignKey
ALTER TABLE "_DocumentPCMSOToProfessional" DROP CONSTRAINT "_DocumentPCMSOToProfessional_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalToRiskFactorGroupData" DROP CONSTRAINT "_ProfessionalToRiskFactorGroupData_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalToRiskFactorGroupData" DROP CONSTRAINT "_ProfessionalToRiskFactorGroupData_B_fkey";

-- DropForeignKey
ALTER TABLE "_RiskFactorGroupDataToUser" DROP CONSTRAINT "_RiskFactorGroupDataToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RiskFactorGroupDataToUser" DROP CONSTRAINT "_RiskFactorGroupDataToUser_B_fkey";

-- AlterTable
ALTER TABLE "RiskFactorDocument" DROP COLUMN "pcmsoId",
DROP COLUMN "riskGroupId",
ADD COLUMN     "documentDataId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RiskFactorGroupData" DROP COLUMN "approvedBy",
DROP COLUMN "complementaryDocs",
DROP COLUMN "complementarySystems",
DROP COLUMN "coordinatorBy",
DROP COLUMN "elaboratedBy",
DROP COLUMN "hasEmergencyPlan",
DROP COLUMN "isQ5",
DROP COLUMN "months_period_level_2",
DROP COLUMN "months_period_level_3",
DROP COLUMN "months_period_level_4",
DROP COLUMN "months_period_level_5",
DROP COLUMN "revisionBy",
DROP COLUMN "source",
DROP COLUMN "validity",
DROP COLUMN "validityEnd",
DROP COLUMN "validityStart",
DROP COLUMN "visitDate";

-- DropTable
DROP TABLE "DocumentPCMSO";

-- DropTable
DROP TABLE "_DocumentPCMSOToProfessional";

-- DropTable
DROP TABLE "_ProfessionalToRiskFactorGroupData";

-- DropTable
DROP TABLE "_RiskFactorGroupDataToUser";

-- CreateTable
CREATE TABLE "DocumentData" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "validityStart" TIMESTAMP(3),
    "validityEnd" TIMESTAMP(3),
    "status" "StatusEnum" NOT NULL DEFAULT 'PROGRESS',
    "type" "DocumentTypeEnum" NOT NULL,
    "elaboratedBy" TEXT,
    "coordinatorBy" TEXT,
    "revisionBy" TEXT,
    "approvedBy" TEXT,
    "json" JSONB,

    CONSTRAINT "DocumentData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentDataToProfessional" (
    "B" TEXT NOT NULL,
    "A" INTEGER NOT NULL,
    "isSigner" BOOLEAN NOT NULL DEFAULT false,
    "isElaborator" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "_DocumentDataToProfessional_pkey" PRIMARY KEY ("B","A")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentData_companyId_key" ON "DocumentData"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentData_workspaceId_key" ON "DocumentData"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentData_id_companyId_key" ON "DocumentData"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentData_type_workspaceId_companyId_key" ON "DocumentData"("type", "workspaceId", "companyId");

-- AddForeignKey
ALTER TABLE "DocumentData" ADD CONSTRAINT "DocumentData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentData" ADD CONSTRAINT "DocumentData_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDocument" ADD CONSTRAINT "RiskFactorDocument_documentDataId_companyId_fkey" FOREIGN KEY ("documentDataId", "companyId") REFERENCES "DocumentData"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentDataToProfessional" ADD CONSTRAINT "_DocumentDataToProfessional_A_fkey" FOREIGN KEY ("A") REFERENCES "ProfessionalCouncil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentDataToProfessional" ADD CONSTRAINT "_DocumentDataToProfessional_B_fkey" FOREIGN KEY ("B") REFERENCES "DocumentData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
