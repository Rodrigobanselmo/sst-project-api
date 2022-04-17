/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Hierarchy` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Hierarchy" DROP CONSTRAINT "Hierarchy_parentId_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Hierarchy" DROP CONSTRAINT "Hierarchy_workplaceId_companyId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Hierarchy_id_key" ON "Hierarchy"("id");

-- AddForeignKey
ALTER TABLE "Hierarchy" ADD CONSTRAINT "Hierarchy_workplaceId_companyId_fkey" FOREIGN KEY ("workplaceId", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hierarchy" ADD CONSTRAINT "Hierarchy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
