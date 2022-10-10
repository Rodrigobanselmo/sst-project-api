-- AlterTable
ALTER TABLE "EmployeeExamsHistory" ADD COLUMN     "subOfficeId" TEXT;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_subOfficeId_fkey" FOREIGN KEY ("subOfficeId") REFERENCES "Hierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
