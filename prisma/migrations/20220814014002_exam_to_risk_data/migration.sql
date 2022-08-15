/*
  Warnings:

  - The primary key for the `ExamToRiskData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ExamToRiskData` table. All the data in the column will be lost.
  - You are about to drop the column `riskDataId` on the `ExamToRiskData` table. All the data in the column will be lost.
  - Added the required column `riskFactorDataId` to the `ExamToRiskData` table without a default value. This is not possible if the table is not empty.
  - Made the column `examId` on table `ExamToRiskData` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExamToRiskData" DROP CONSTRAINT "ExamToRiskData_examId_fkey";

-- DropForeignKey
ALTER TABLE "ExamToRiskData" DROP CONSTRAINT "ExamToRiskData_riskDataId_fkey";

-- DropIndex
DROP INDEX "ExamToRiskData_examId_riskDataId_key";

-- AlterTable
ALTER TABLE "ExamToRiskData" DROP CONSTRAINT "ExamToRiskData_pkey",
DROP COLUMN "id",
DROP COLUMN "riskDataId",
ADD COLUMN     "fromAge" INTEGER,
ADD COLUMN     "isAdmission" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isChange" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDismissal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFemale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPeriodic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReturn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "riskFactorDataId" TEXT NOT NULL,
ADD COLUMN     "toAge" INTEGER,
ADD COLUMN     "validityInMonths" INTEGER,
ALTER COLUMN "examId" SET NOT NULL,
ADD CONSTRAINT "ExamToRiskData_pkey" PRIMARY KEY ("examId", "riskFactorDataId");

-- AddForeignKey
ALTER TABLE "ExamToRiskData" ADD CONSTRAINT "ExamToRiskData_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToRiskData" ADD CONSTRAINT "ExamToRiskData_riskFactorDataId_fkey" FOREIGN KEY ("riskFactorDataId") REFERENCES "RiskFactorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
