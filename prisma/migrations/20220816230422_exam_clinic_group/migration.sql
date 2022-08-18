/*
  Warnings:

  - A unique constraint covering the columns `[examId,companyId,startDate,groupId]` on the table `ExamToClinic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ExamToClinic_examId_companyId_startDate_key";

-- AlterTable
ALTER TABLE "ExamToClinic" ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "isAdmission" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isChange" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDismissal" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPeriodic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isReturn" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "ExamToClinic_examId_companyId_startDate_groupId_key" ON "ExamToClinic"("examId", "companyId", "startDate", "groupId");
