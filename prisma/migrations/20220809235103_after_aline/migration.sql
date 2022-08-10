-- CreateEnum
CREATE TYPE "ClinicScheduleTypeEnum" AS ENUM ('PHONE', 'EMAIL', 'ONLINE', 'ASK', 'NONE');

-- CreateEnum
CREATE TYPE "CompanyPaymentTypeEnum" AS ENUM ('ANTICIPATED', 'DEBIT');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "paymentDay" INTEGER,
ADD COLUMN     "paymentType" "CompanyPaymentTypeEnum";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "esocial27Code" TEXT;

-- AlterTable
ALTER TABLE "ExamToClinic" ADD COLUMN     "examMinDuration" TEXT,
ADD COLUMN     "scheduleType" "ClinicScheduleTypeEnum";
