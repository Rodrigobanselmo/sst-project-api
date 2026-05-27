-- AlterEnum
ALTER TYPE "SystemAiPromptKeyEnum" ADD VALUE 'INDICATORS_NARRATIVE_DIAGNOSTIC';

-- CreateTable
CREATE TABLE "FormIndicatorsNarrativeDiagnostic" (
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

    CONSTRAINT "FormIndicatorsNarrativeDiagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormIndicatorsNarrativeDiagnostic_formApplicationId_scopeKey_key" ON "FormIndicatorsNarrativeDiagnostic"("formApplicationId", "scopeKey");

-- CreateIndex
CREATE INDEX "FormIndicatorsNarrativeDiagnostic_companyId_idx" ON "FormIndicatorsNarrativeDiagnostic"("companyId");

-- CreateIndex
CREATE INDEX "FormIndicatorsNarrativeDiagnostic_formApplicationId_idx" ON "FormIndicatorsNarrativeDiagnostic"("formApplicationId");

-- CreateIndex
CREATE INDEX "FormIndicatorsNarrativeDiagnostic_status_idx" ON "FormIndicatorsNarrativeDiagnostic"("status");

-- AddForeignKey
ALTER TABLE "FormIndicatorsNarrativeDiagnostic" ADD CONSTRAINT "FormIndicatorsNarrativeDiagnostic_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormIndicatorsNarrativeDiagnostic" ADD CONSTRAINT "FormIndicatorsNarrativeDiagnostic_formApplicationId_fkey" FOREIGN KEY ("formApplicationId") REFERENCES "FormApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormIndicatorsNarrativeDiagnostic" ADD CONSTRAINT "FormIndicatorsNarrativeDiagnostic_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
