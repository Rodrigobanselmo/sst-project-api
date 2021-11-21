/*
  Warnings:

  - You are about to drop the column `parentCompanyId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `License` table. All the data in the column will be lost.
  - You are about to drop the `RelatedCompanies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_parentCompanyId_id_fkey";

-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_companyId_fkey";

-- DropIndex
DROP INDEX "Company_parentCompanyId_id_key";

-- DropIndex
DROP INDEX "License_companyId_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "parentCompanyId";

-- AlterTable
ALTER TABLE "License" DROP COLUMN "companyId";

-- DropTable
DROP TABLE "RelatedCompanies";

-- CreateTable
CREATE TABLE "Contract" (
    "ownerCompanyId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("ownerCompanyId","companyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_companyId_key" ON "Contract"("companyId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_ownerCompanyId_fkey" FOREIGN KEY ("ownerCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
