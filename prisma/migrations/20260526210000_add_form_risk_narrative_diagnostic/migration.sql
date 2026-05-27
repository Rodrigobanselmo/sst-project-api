-- CreateTable
CREATE TABLE "FormRiskNarrativeDiagnostic" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "formApplicationId" TEXT NOT NULL,
    "scopeKey" TEXT NOT NULL,
    "scope" JSONB NOT NULL,
    "status" "FormAiAnalysisStatusEnum" NOT NULL DEFAULT 'PROCESSING',
    "contentMarkdown" TEXT,
    "metadata" JSONB,
    "model" TEXT,
    "generatedBy" INTEGER,
    "processingTimeMs" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormRiskNarrativeDiagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormRiskNarrativeDiagnostic_formApplicationId_scopeKey_key" ON "FormRiskNarrativeDiagnostic"("formApplicationId", "scopeKey");

-- CreateIndex
CREATE INDEX "FormRiskNarrativeDiagnostic_companyId_idx" ON "FormRiskNarrativeDiagnostic"("companyId");

-- CreateIndex
CREATE INDEX "FormRiskNarrativeDiagnostic_formApplicationId_idx" ON "FormRiskNarrativeDiagnostic"("formApplicationId");

-- CreateIndex
CREATE INDEX "FormRiskNarrativeDiagnostic_status_idx" ON "FormRiskNarrativeDiagnostic"("status");

-- AddForeignKey
ALTER TABLE "FormRiskNarrativeDiagnostic" ADD CONSTRAINT "FormRiskNarrativeDiagnostic_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormRiskNarrativeDiagnostic" ADD CONSTRAINT "FormRiskNarrativeDiagnostic_formApplicationId_fkey" FOREIGN KEY ("formApplicationId") REFERENCES "FormApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormRiskNarrativeDiagnostic" ADD CONSTRAINT "FormRiskNarrativeDiagnostic_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
