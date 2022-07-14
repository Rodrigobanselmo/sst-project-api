-- DropForeignKey
ALTER TABLE "HierarchyOnHomogeneous" DROP CONSTRAINT "HierarchyOnHomogeneous_hierarchyId_fkey";

-- DropForeignKey
ALTER TABLE "HierarchyOnHomogeneous" DROP CONSTRAINT "HierarchyOnHomogeneous_homogeneousGroupId_fkey";

-- DropForeignKey
ALTER TABLE "HierarchyOnHomogeneous" DROP CONSTRAINT "HierarchyOnHomogeneous_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "HierarchyOnHomogeneous" ADD CONSTRAINT "HierarchyOnHomogeneous_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HierarchyOnHomogeneous" ADD CONSTRAINT "HierarchyOnHomogeneous_homogeneousGroupId_fkey" FOREIGN KEY ("homogeneousGroupId") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HierarchyOnHomogeneous" ADD CONSTRAINT "HierarchyOnHomogeneous_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
