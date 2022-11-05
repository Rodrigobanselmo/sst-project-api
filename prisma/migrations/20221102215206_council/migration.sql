-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_doctorResponsibleId_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_tecResponsibleId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyGroup" DROP CONSTRAINT "CompanyGroup_doctorResponsibleId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeExamsHistory" DROP CONSTRAINT "EmployeeExamsHistory_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "_DocumentPCMSOToProfessional" DROP CONSTRAINT "_DocumentPCMSOToProfessional_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalToRiskFactorGroupData" DROP CONSTRAINT "_ProfessionalToRiskFactorGroupData_A_fkey";

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_doctorResponsibleId_fkey" FOREIGN KEY ("doctorResponsibleId") REFERENCES "ProfessionalCouncil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_tecResponsibleId_fkey" FOREIGN KEY ("tecResponsibleId") REFERENCES "ProfessionalCouncil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyGroup" ADD CONSTRAINT "CompanyGroup_doctorResponsibleId_fkey" FOREIGN KEY ("doctorResponsibleId") REFERENCES "ProfessionalCouncil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "ProfessionalCouncil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalToRiskFactorGroupData" ADD CONSTRAINT "_ProfessionalToRiskFactorGroupData_A_fkey" FOREIGN KEY ("A") REFERENCES "ProfessionalCouncil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentPCMSOToProfessional" ADD CONSTRAINT "_DocumentPCMSOToProfessional_A_fkey" FOREIGN KEY ("A") REFERENCES "ProfessionalCouncil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
