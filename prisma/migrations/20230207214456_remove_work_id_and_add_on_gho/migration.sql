/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `HierarchyOnHomogeneous` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hierarchyId,homogeneousGroupId,endDate,startDate]` on the table `HierarchyOnHomogeneous` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "HierarchyOnHomogeneous" DROP CONSTRAINT "HierarchyOnHomogeneous_workspaceId_fkey";

-- DropIndex
DROP INDEX "HierarchyOnHomogeneous_hierarchyId_homogeneousGroupId_works_key";

-- AlterTable
ALTER TABLE "HierarchyOnHomogeneous" DROP COLUMN "workspaceId";

-- CreateTable
CREATE TABLE "_HomogeneousGroupToWorkspace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HomogeneousGroupToWorkspace_AB_unique" ON "_HomogeneousGroupToWorkspace"("A", "B");

-- CreateIndex
CREATE INDEX "_HomogeneousGroupToWorkspace_B_index" ON "_HomogeneousGroupToWorkspace"("B");

-- CreateIndex
CREATE UNIQUE INDEX "HierarchyOnHomogeneous_hierarchyId_homogeneousGroupId_endDa_key" ON "HierarchyOnHomogeneous"("hierarchyId", "homogeneousGroupId", "endDate", "startDate");

-- CreateIndex
CREATE INDEX "RiskFactors_name_idx" ON "RiskFactors"("name");

-- AddForeignKey
ALTER TABLE "_HomogeneousGroupToWorkspace" ADD CONSTRAINT "_HomogeneousGroupToWorkspace_A_fkey" FOREIGN KEY ("A") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomogeneousGroupToWorkspace" ADD CONSTRAINT "_HomogeneousGroupToWorkspace_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
