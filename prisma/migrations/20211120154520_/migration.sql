/*
  Warnings:

  - A unique constraint covering the columns `[parentCompanyId]` on the table `RelatedCompanies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RelatedCompanies_parentCompanyId_key" ON "RelatedCompanies"("parentCompanyId");
