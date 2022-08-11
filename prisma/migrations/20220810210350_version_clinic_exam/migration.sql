/*
  Warnings:

  - You are about to drop the `ExamToClinicPricing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExamToClinicPricing" DROP CONSTRAINT "ExamToClinicPricing_examToClinicId_fkey";

-- DropIndex
DROP INDEX "ExamToClinic_examId_companyId_key";

-- AlterTable
ALTER TABLE "ExamToClinic" ADD COLUMN     "price" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ExamToClinicPricing";
