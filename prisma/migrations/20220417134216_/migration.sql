/*
  Warnings:

  - The primary key for the `HomogeneousGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_HierarchyToHomogeneousGroup" DROP CONSTRAINT "_HierarchyToHomogeneousGroup_B_fkey";

-- AlterTable
ALTER TABLE "HomogeneousGroup" DROP CONSTRAINT "HomogeneousGroup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "HomogeneousGroup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "HomogeneousGroup_id_seq";

-- AlterTable
ALTER TABLE "_HierarchyToHomogeneousGroup" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_HierarchyToHomogeneousGroup" ADD FOREIGN KEY ("B") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
