-- AlterTable
ALTER TABLE "ExamToRisk" ADD COLUMN     "minRiskDegree" INTEGER DEFAULT 1,
ADD COLUMN     "minRiskDegreeQuantity" INTEGER DEFAULT 1;
