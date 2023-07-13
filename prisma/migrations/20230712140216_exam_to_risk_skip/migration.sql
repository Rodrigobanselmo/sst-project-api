-- CreateTable
CREATE TABLE "ExamToRiskSkipCompany" (
    "id" SERIAL NOT NULL,
    "companyId" TEXT NOT NULL,
    "examToRiskId" INTEGER NOT NULL,

    CONSTRAINT "ExamToRiskSkipCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamToRiskSkipCompany_examToRiskId_companyId_key" ON "ExamToRiskSkipCompany"("examToRiskId", "companyId");

-- AddForeignKey
ALTER TABLE "ExamToRiskSkipCompany" ADD CONSTRAINT "ExamToRiskSkipCompany_examToRiskId_fkey" FOREIGN KEY ("examToRiskId") REFERENCES "ExamToRisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToRiskSkipCompany" ADD CONSTRAINT "ExamToRiskSkipCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
