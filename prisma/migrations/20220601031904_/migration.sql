/*
  Warnings:

  - Added the required column `workspaceId` to the `RiskFactorGroupData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiskFactorGroupData" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RiskFactorGroupData" ADD CONSTRAINT "RiskFactorGroupData_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
