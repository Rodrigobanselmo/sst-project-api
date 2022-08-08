-- CreateEnum
CREATE TYPE "ExamTypeEnum" AS ENUM ('LAB', 'AUDIO', 'VISUAL', 'OTHERS');

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "analisys" TEXT,
    "instruction" TEXT,
    "material" TEXT,
    "companyId" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "type" "ExamTypeEnum",
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "system" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamToRisk" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER,
    "riskId" TEXT,

    CONSTRAINT "ExamToRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamToRiskData" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER,
    "riskDataId" TEXT,

    CONSTRAINT "ExamToRiskData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exam_id_companyId_key" ON "Exam"("id", "companyId");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToRisk" ADD CONSTRAINT "ExamToRisk_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToRisk" ADD CONSTRAINT "ExamToRisk_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToRiskData" ADD CONSTRAINT "ExamToRiskData_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToRiskData" ADD CONSTRAINT "ExamToRiskData_riskDataId_fkey" FOREIGN KEY ("riskDataId") REFERENCES "RiskFactorData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
