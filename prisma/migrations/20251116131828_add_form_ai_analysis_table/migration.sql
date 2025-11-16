-- CreateTable
CREATE TABLE "FormAiAnalysis" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "formApplicationId" TEXT NOT NULL,
    "hierarchyId" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "analysis" JSONB NOT NULL,
    "metadata" JSONB,
    "model" TEXT,
    "processingTimeMs" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormAiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormAiAnalysis_companyId_idx" ON "FormAiAnalysis"("companyId");

-- CreateIndex
CREATE INDEX "FormAiAnalysis_formApplicationId_idx" ON "FormAiAnalysis"("formApplicationId");

-- CreateIndex
CREATE INDEX "FormAiAnalysis_hierarchyId_idx" ON "FormAiAnalysis"("hierarchyId");

-- CreateIndex
CREATE INDEX "FormAiAnalysis_riskId_idx" ON "FormAiAnalysis"("riskId");

-- CreateIndex
CREATE UNIQUE INDEX "FormAiAnalysis_formApplicationId_hierarchyId_riskId_key" ON "FormAiAnalysis"("formApplicationId", "hierarchyId", "riskId");

-- AddForeignKey
ALTER TABLE "FormAiAnalysis" ADD CONSTRAINT "FormAiAnalysis_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAiAnalysis" ADD CONSTRAINT "FormAiAnalysis_formApplicationId_fkey" FOREIGN KEY ("formApplicationId") REFERENCES "FormApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAiAnalysis" ADD CONSTRAINT "FormAiAnalysis_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAiAnalysis" ADD CONSTRAINT "FormAiAnalysis_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
