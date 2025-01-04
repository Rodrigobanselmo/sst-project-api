/*
  Warnings:

  - A unique constraint covering the columns `[riskFactorDataId,recMedId,workspaceId]` on the table `RiskFactorDataRec` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `RiskFactorDataRec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RiskFactorDataRecComments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatusEnum" ADD VALUE 'WATTING_APPROVAL';
ALTER TYPE "StatusEnum" ADD VALUE 'REJECTED';

-- DropIndex
DROP INDEX "RiskFactorDataRec_riskFactorDataId_recMedId_companyId_key";

-- AlterTable
ALTER TABLE "DocumentData" ADD COLUMN     "coordinatorId" INTEGER,
ADD COLUMN     "months_period_level_2" INTEGER NOT NULL DEFAULT 24,
ADD COLUMN     "months_period_level_3" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "months_period_level_4" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN     "months_period_level_5" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "RiskFactorDataRec" ADD COLUMN     "canceledDate" TIMESTAMP(3),
ADD COLUMN     "doneDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RiskFactorDataRecComments" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" INTEGER,
ADD COLUMN     "approvedComment" TEXT,
ADD COLUMN     "isApproved" BOOLEAN,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorDataRec_riskFactorDataId_recMedId_workspaceId_key" ON "RiskFactorDataRec"("riskFactorDataId", "recMedId", "workspaceId");

-- AddForeignKey
ALTER TABLE "DocumentData" ADD CONSTRAINT "DocumentData_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDataRec" ADD CONSTRAINT "RiskFactorDataRec_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDataRecComments" ADD CONSTRAINT "RiskFactorDataRecComments_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDataRecComments" ADD CONSTRAINT "RiskFactorDataRecComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
