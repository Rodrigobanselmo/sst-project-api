-- CreateEnum
CREATE TYPE "SystemAiPromptKeyEnum" AS ENUM ('RISK_SOURCES_RECOMMENDATIONS', 'RISK_NARRATIVE_DIAGNOSTIC', 'INDICATORS_NARRATIVE_ANALYSIS');

-- CreateTable
CREATE TABLE "SystemAiPrompt" (
    "id" TEXT NOT NULL,
    "key" "SystemAiPromptKeyEnum" NOT NULL,
    "content" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "updatedBy" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemAiPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemAiPrompt_key_key" ON "SystemAiPrompt"("key");

-- CreateIndex
CREATE INDEX "SystemAiPrompt_key_idx" ON "SystemAiPrompt"("key");

-- AddForeignKey
ALTER TABLE "SystemAiPrompt" ADD CONSTRAINT "SystemAiPrompt_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
