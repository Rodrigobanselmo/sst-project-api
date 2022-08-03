-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "doctorResponsibleId" INTEGER,
ADD COLUMN     "initials" TEXT,
ADD COLUMN     "responsibleCpf" TEXT,
ADD COLUMN     "responsibleNit" TEXT,
ADD COLUMN     "stateRegistration" TEXT,
ADD COLUMN     "tecResponsibleId" INTEGER,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "CompanyGroup" ADD COLUMN     "doctorResponsibleId" INTEGER;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_doctorResponsibleId_fkey" FOREIGN KEY ("doctorResponsibleId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_tecResponsibleId_fkey" FOREIGN KEY ("tecResponsibleId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyGroup" ADD CONSTRAINT "CompanyGroup_doctorResponsibleId_fkey" FOREIGN KEY ("doctorResponsibleId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
