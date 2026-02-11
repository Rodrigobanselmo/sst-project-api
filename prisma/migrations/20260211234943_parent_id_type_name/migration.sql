/*
  Warnings:

  - A unique constraint covering the columns `[parentId,type,name]` on the table `Hierarchy` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Hierarchy_parentId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Hierarchy_parentId_type_name_key" ON "Hierarchy"("parentId", "type", "name");
