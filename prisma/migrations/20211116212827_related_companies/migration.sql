-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "isConsulting" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "RelatedCompanies" (
    "parentCompanyId" INTEGER NOT NULL,
    "childCompanyId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RelatedCompanies_pkey" PRIMARY KEY ("parentCompanyId","childCompanyId")
);

-- AddForeignKey
ALTER TABLE "RelatedCompanies" ADD CONSTRAINT "RelatedCompanies_parentCompanyId_fkey" FOREIGN KEY ("parentCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedCompanies" ADD CONSTRAINT "RelatedCompanies_childCompanyId_fkey" FOREIGN KEY ("childCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
