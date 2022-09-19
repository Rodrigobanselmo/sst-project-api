-- CreateTable
CREATE TABLE "RiskFactorsDocInfo" (
    "id" SERIAL NOT NULL,
    "riskId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "hierarchyId" TEXT,
    "isAso" BOOLEAN NOT NULL DEFAULT true,
    "isPGR" BOOLEAN NOT NULL DEFAULT true,
    "isPCMSO" BOOLEAN NOT NULL DEFAULT true,
    "isPPP" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskFactorsDocInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RiskFactorsDocInfo_companyId_idx" ON "RiskFactorsDocInfo"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorsDocInfo_companyId_riskId_hierarchyId_key" ON "RiskFactorsDocInfo"("companyId", "riskId", "hierarchyId");

-- CreateIndex
CREATE INDEX "Address_companyId_idx" ON "Address"("companyId");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_isClinic_idx" ON "Company"("isClinic");

-- CreateIndex
CREATE INDEX "Company_isConsulting_idx" ON "Company"("isConsulting");

-- CreateIndex
CREATE INDEX "Company_initials_idx" ON "Company"("initials");

-- CreateIndex
CREATE INDEX "Company_fantasy_idx" ON "Company"("fantasy");

-- CreateIndex
CREATE INDEX "Company_cnpj_idx" ON "Company"("cnpj");

-- CreateIndex
CREATE INDEX "Exam_companyId_idx" ON "Exam"("companyId");

-- CreateIndex
CREATE INDEX "RiskFactorData_companyId_idx" ON "RiskFactorData"("companyId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserCompany_companyId_idx" ON "UserCompany"("companyId");

-- CreateIndex
CREATE INDEX "Workspace_companyId_idx" ON "Workspace"("companyId");

-- AddForeignKey
ALTER TABLE "RiskFactorsDocInfo" ADD CONSTRAINT "RiskFactorsDocInfo_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorsDocInfo" ADD CONSTRAINT "RiskFactorsDocInfo_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorsDocInfo" ADD CONSTRAINT "RiskFactorsDocInfo_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
