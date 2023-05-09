-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyReport" DROP CONSTRAINT "CompanyReport_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyShift" DROP CONSTRAINT "CompanyShift_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ExamToClinic" DROP CONSTRAINT "ExamToClinic_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleBlock" DROP CONSTRAINT "ScheduleBlock_companyId_fkey";

-- CreateIndex
CREATE INDEX "Employee_companyId_idx" ON "Employee"("companyId");

-- CreateIndex
CREATE INDEX "Employee_expiredDateExam_idx" ON "Employee"("expiredDateExam");

-- AddForeignKey
ALTER TABLE "CompanyReport" ADD CONSTRAINT "CompanyReport_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyShift" ADD CONSTRAINT "CompanyShift_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToClinic" ADD CONSTRAINT "ExamToClinic_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleBlock" ADD CONSTRAINT "ScheduleBlock_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
