/*
  Warnings:

  - A unique constraint covering the columns `[hierarchyId,homogeneousGroupId,workspaceId,endDate,startDate]` on the table `HierarchyOnHomogeneous` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HierarchyOnHomogeneous_hierarchyId_homogeneousGroupId_works_key" ON "HierarchyOnHomogeneous"("hierarchyId", "homogeneousGroupId", "workspaceId", "endDate", "startDate");
