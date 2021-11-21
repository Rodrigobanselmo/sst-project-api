/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `License` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "licenseId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "License_companyId_key" ON "License"("companyId");

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
