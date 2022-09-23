/*
  Warnings:

  - A unique constraint covering the columns `[parentId,name]` on the table `Hierarchy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hierarchy_parentId_name_key" ON "Hierarchy"("parentId", "name");
