-- DropForeignKey
ALTER TABLE "Hierarchy" DROP CONSTRAINT "Hierarchy_workplaceId_companyId_fkey";

-- AddForeignKey
ALTER TABLE "Hierarchy" ADD CONSTRAINT "Hierarchy_workplaceId_companyId_fkey" FOREIGN KEY ("workplaceId", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
