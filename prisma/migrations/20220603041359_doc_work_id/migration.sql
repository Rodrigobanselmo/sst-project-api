/*
  Warnings:

  - Added the required column `workspaceId` to the `RiskFactorDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceName` to the `RiskFactorDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiskFactorDocument" ADD COLUMN     "workspaceId" TEXT NOT NULL,
ADD COLUMN     "workspaceName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RiskFactorDocument" ADD CONSTRAINT "RiskFactorDocument_id_companyId_fkey" FOREIGN KEY ("id", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
