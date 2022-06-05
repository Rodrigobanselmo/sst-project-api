/*
  Warnings:

  - A unique constraint covering the columns `[name,companyId]` on the table `HomogeneousGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HomogeneousGroup_name_companyId_key" ON "HomogeneousGroup"("name", "companyId");
