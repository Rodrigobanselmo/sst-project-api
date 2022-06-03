-- DropForeignKey
ALTER TABLE "RiskFactorDocument" DROP CONSTRAINT "RiskFactorDocument_id_companyId_fkey";

-- AddForeignKey
ALTER TABLE "RiskFactorDocument" ADD CONSTRAINT "RiskFactorDocument_workspaceId_companyId_fkey" FOREIGN KEY ("workspaceId", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
