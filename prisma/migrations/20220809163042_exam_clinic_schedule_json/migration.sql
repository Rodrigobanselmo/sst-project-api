/*
  Warnings:

  - You are about to drop the `ExamToClinicSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExamToClinicSchedule" DROP CONSTRAINT "ExamToClinicSchedule_examToClinicId_fkey";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "isAttendance" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ExamToClinic" ADD COLUMN     "scheduleRange" JSONB,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "ExamToClinicSchedule";
