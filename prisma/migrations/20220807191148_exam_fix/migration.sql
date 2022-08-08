/*
  Warnings:

  - You are about to drop the column `analisys` on the `Exam` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[examId,riskId]` on the table `ExamToRisk` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[examId,riskDataId]` on the table `ExamToRiskData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "analisys",
ADD COLUMN     "analyses" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "ExamToRisk_examId_riskId_key" ON "ExamToRisk"("examId", "riskId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamToRiskData_examId_riskDataId_key" ON "ExamToRiskData"("examId", "riskDataId");
