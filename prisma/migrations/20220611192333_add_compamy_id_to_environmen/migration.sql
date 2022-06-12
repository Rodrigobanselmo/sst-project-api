/*
  Warnings:

  - Added the required column `companyId` to the `CompanyEnvironment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyEnvironment" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CompanyEnvironment" ADD CONSTRAINT "CompanyEnvironment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
