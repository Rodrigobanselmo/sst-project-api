-- AlterTable
ALTER TABLE "CompanyGroup" ADD COLUMN     "tecResponsibleId" INTEGER;

-- AddForeignKey
ALTER TABLE "CompanyGroup" ADD CONSTRAINT "CompanyGroup_tecResponsibleId_fkey" FOREIGN KEY ("tecResponsibleId") REFERENCES "ProfessionalCouncil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
