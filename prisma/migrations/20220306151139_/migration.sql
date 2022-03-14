/*
  Warnings:

  - The primary key for the `Hierarchy` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_hierarchyId_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Hierarchy" DROP CONSTRAINT "Hierarchy_parentId_companyId_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "hierarchyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Hierarchy" DROP CONSTRAINT "Hierarchy_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Hierarchy_pkey" PRIMARY KEY ("id", "companyId");
DROP SEQUENCE "Hierarchy_id_seq";

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_hierarchyId_companyId_fkey" FOREIGN KEY ("hierarchyId", "companyId") REFERENCES "Hierarchy"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hierarchy" ADD CONSTRAINT "Hierarchy_parentId_companyId_fkey" FOREIGN KEY ("parentId", "companyId") REFERENCES "Hierarchy"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
