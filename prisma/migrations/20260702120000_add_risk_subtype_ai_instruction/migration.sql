-- AlterEnum
ALTER TYPE "SystemAiPromptKeyEnum" ADD VALUE IF NOT EXISTS 'RISK_SUBTYPE_CURATION_SUGGESTIONS';

-- CreateTable
CREATE TABLE "RiskSubTypeAiInstruction" (
    "id" SERIAL NOT NULL,
    "subTypeId" INTEGER NOT NULL,
    "useSystemDefault" BOOLEAN NOT NULL DEFAULT true,
    "instructions" TEXT,
    "positiveExamples" TEXT,
    "negativeExamples" TEXT,
    "cautionRules" TEXT,
    "preferredModel" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "updatedById" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskSubTypeAiInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RiskSubTypeAiInstruction_subTypeId_key" ON "RiskSubTypeAiInstruction"("subTypeId");

-- CreateIndex
CREATE INDEX "RiskSubTypeAiInstruction_subTypeId_idx" ON "RiskSubTypeAiInstruction"("subTypeId");

-- AddForeignKey
ALTER TABLE "RiskSubTypeAiInstruction" ADD CONSTRAINT "RiskSubTypeAiInstruction_subTypeId_fkey" FOREIGN KEY ("subTypeId") REFERENCES "RiskSubType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskSubTypeAiInstruction" ADD CONSTRAINT "RiskSubTypeAiInstruction_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
