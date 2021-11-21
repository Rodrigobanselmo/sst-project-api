/*
  Warnings:

  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RelatedCompanies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserCompany` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_companyId_fkey";

-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_companyId_fkey";

-- DropForeignKey
ALTER TABLE "RelatedCompanies" DROP CONSTRAINT "RelatedCompanies_childCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "RelatedCompanies" DROP CONSTRAINT "RelatedCompanies_parentCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "UserCompany" DROP CONSTRAINT "UserCompany_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_companyId_fkey";

-- DropForeignKey
ALTER TABLE "_primary_activity" DROP CONSTRAINT "_primary_activity_B_fkey";

-- DropForeignKey
ALTER TABLE "_secondary_activity" DROP CONSTRAINT "_secondary_activity_B_fkey";

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Company_id_seq";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "companyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "InviteUsers" ALTER COLUMN "companyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "License" ALTER COLUMN "companyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RelatedCompanies" DROP CONSTRAINT "RelatedCompanies_pkey",
ALTER COLUMN "parentCompanyId" SET DATA TYPE TEXT,
ALTER COLUMN "childCompanyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "RelatedCompanies_pkey" PRIMARY KEY ("parentCompanyId", "childCompanyId");

-- AlterTable
ALTER TABLE "UserCompany" DROP CONSTRAINT "UserCompany_pkey",
ALTER COLUMN "companyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserCompany_pkey" PRIMARY KEY ("companyId", "userId");

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "companyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_primary_activity" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_secondary_activity" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedCompanies" ADD CONSTRAINT "RelatedCompanies_parentCompanyId_fkey" FOREIGN KEY ("parentCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedCompanies" ADD CONSTRAINT "RelatedCompanies_childCompanyId_fkey" FOREIGN KEY ("childCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_primary_activity" ADD FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondary_activity" ADD FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
