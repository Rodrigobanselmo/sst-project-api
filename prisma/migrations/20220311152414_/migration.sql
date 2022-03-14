/*
  Warnings:

  - Added the required column `workplaceId` to the `Hierarchy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hierarchy" ADD COLUMN     "workplaceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Hierarchy" ADD CONSTRAINT "Hierarchy_workplaceId_companyId_fkey" FOREIGN KEY ("workplaceId", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
