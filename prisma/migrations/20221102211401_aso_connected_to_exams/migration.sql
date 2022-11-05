-- AlterTable
ALTER TABLE "EmployeeExamsHistory" ADD COLUMN     "asoExamId" INTEGER;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_asoExamId_fkey" FOREIGN KEY ("asoExamId") REFERENCES "EmployeeExamsHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
