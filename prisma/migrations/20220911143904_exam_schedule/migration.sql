-- AlterEnum
ALTER TYPE "ExamHistoryTypeEnum" ADD VALUE 'OFFI';

-- AlterTable
ALTER TABLE "EmployeeExamsHistory" ADD COLUMN     "changeHierarchyAnyway" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "changeHierarchyDate" TIMESTAMP(3),
ADD COLUMN     "clinicObs" TEXT,
ADD COLUMN     "hierarchyId" TEXT,
ADD COLUMN     "scheduleType" "ClinicScheduleTypeEnum";

-- CreateIndex
CREATE INDEX "Employee_esocialCode_idx" ON "Employee"("esocialCode");

-- CreateIndex
CREATE INDEX "EmployeeExamsHistory_status_idx" ON "EmployeeExamsHistory"("status");

-- CreateIndex
CREATE INDEX "EmployeeExamsHistory_employeeId_idx" ON "EmployeeExamsHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeExamsHistory_clinicId_idx" ON "EmployeeExamsHistory"("clinicId");

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
