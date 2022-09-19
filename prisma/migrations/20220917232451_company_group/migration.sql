/*
  Warnings:

  - A unique constraint covering the columns `[companyGroupId]` on the table `CompanyGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CompanyGroup" ADD COLUMN     "companyGroupId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CompanyGroup_companyGroupId_key" ON "CompanyGroup"("companyGroupId");

-- AddForeignKey
ALTER TABLE "CompanyGroup" ADD CONSTRAINT "CompanyGroup_companyGroupId_fkey" FOREIGN KEY ("companyGroupId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
