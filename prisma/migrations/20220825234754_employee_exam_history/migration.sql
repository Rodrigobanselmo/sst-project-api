-- CreateEnum
CREATE TYPE "ExamHistoryTypeEnum" AS ENUM ('ADMI', 'PERI', 'RETU', 'CHAN', 'EVAL', 'DEMI');

-- CreateEnum
CREATE TYPE "ExamHistoryEvaluationEnum" AS ENUM ('NONE', 'APTO', 'INAPT', 'INCONCLUSIVE');

-- CreateEnum
CREATE TYPE "ExamHistoryConclusionEnum" AS ENUM ('NORMAL', 'ALTER', 'ALTER_1', 'ALTER_2', 'ALTER_3', 'NONE');

-- AlterTable
ALTER TABLE "EmployeeExamsHistory" ADD COLUMN     "clinicId" TEXT,
ADD COLUMN     "conclusion" "ExamHistoryConclusionEnum",
ADD COLUMN     "doctorId" INTEGER,
ADD COLUMN     "evaluationType" "ExamHistoryEvaluationEnum",
ADD COLUMN     "examType" "ExamHistoryTypeEnum",
ADD COLUMN     "obs" TEXT,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'DONE',
ADD COLUMN     "userDoneId" INTEGER,
ADD COLUMN     "userScheduleId" INTEGER;

-- AlterTable
ALTER TABLE "ExamToRisk" ADD COLUMN     "considerBetweenDays" INTEGER;

-- AlterTable
ALTER TABLE "ExamToRiskData" ADD COLUMN     "considerBetweenDays" INTEGER;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_userScheduleId_fkey" FOREIGN KEY ("userScheduleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_userDoneId_fkey" FOREIGN KEY ("userDoneId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
