/*
  Warnings:

  - A unique constraint covering the columns `[parentCompanyId,id]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RelatedCompanies" DROP CONSTRAINT "RelatedCompanies_parentCompanyId_fkey";

-- DropIndex
DROP INDEX "RelatedCompanies_parentCompanyId_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "parentCompanyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Company_parentCompanyId_id_key" ON "Company"("parentCompanyId", "id");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_parentCompanyId_id_fkey" FOREIGN KEY ("parentCompanyId", "id") REFERENCES "RelatedCompanies"("parentCompanyId", "childCompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;
