/*
  Warnings:

  - A unique constraint covering the columns `[id,companyId]` on the table `ExamToRisk` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `ExamToRisk` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ExamToRisk_examId_riskId_key";

-- AlterTable
ALTER TABLE "ExamToRisk" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "fromAge" INTEGER,
ADD COLUMN     "isAdmission" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isChange" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDismissal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFemale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPeriodic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReturn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "toAge" INTEGER,
ADD COLUMN     "validityInMonths" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ExamToRisk_id_companyId_key" ON "ExamToRisk"("id", "companyId");

-- AddForeignKey
ALTER TABLE "ExamToRisk" ADD CONSTRAINT "ExamToRisk_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
