/*
  Warnings:

  - You are about to drop the column `companyGroupId` on the `CompanyGroup` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyGroupId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CompanyGroup" DROP CONSTRAINT "CompanyGroup_companyGroupId_fkey";

-- DropIndex
DROP INDEX "CompanyGroup_companyGroupId_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "companyGroupId" INTEGER;

-- AlterTable
ALTER TABLE "CompanyGroup" DROP COLUMN "companyGroupId";

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyGroupId_key" ON "Company"("companyGroupId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_companyGroupId_fkey" FOREIGN KEY ("companyGroupId") REFERENCES "CompanyGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
