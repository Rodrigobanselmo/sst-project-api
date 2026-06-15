-- CreateTable
CREATE TABLE "HoMethodAgent" (
    "id" TEXT NOT NULL,
    "hoMethodId" TEXT NOT NULL,
    "riskFactorId" TEXT NOT NULL,
    "agentNameSnapshot" TEXT,
    "casSnapshot" TEXT,
    "unitSnapshot" TEXT,
    "agentType" "HoMethodAgentTypeEnum",
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "HoMethodAgent_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "HoMethodEvaluationCondition" ADD COLUMN "hoMethodAgentId" TEXT;

-- DropIndex
DROP INDEX IF EXISTS "HoMethodEvaluationCondition_hoMethodId_evaluationType_key";

-- CreateIndex
CREATE INDEX "HoMethodAgent_hoMethodId_idx" ON "HoMethodAgent"("hoMethodId");
CREATE INDEX "HoMethodAgent_riskFactorId_idx" ON "HoMethodAgent"("riskFactorId");
CREATE INDEX "HoMethodEvaluationCondition_hoMethodId_idx" ON "HoMethodEvaluationCondition"("hoMethodId");
CREATE INDEX "HoMethodEvaluationCondition_hoMethodAgentId_idx" ON "HoMethodEvaluationCondition"("hoMethodAgentId");
CREATE UNIQUE INDEX "HoMethodEvaluationCondition_hoMethodAgentId_evaluationType_key" ON "HoMethodEvaluationCondition"("hoMethodAgentId", "evaluationType");

-- AddForeignKey
ALTER TABLE "HoMethodAgent" ADD CONSTRAINT "HoMethodAgent_hoMethodId_fkey" FOREIGN KEY ("hoMethodId") REFERENCES "HoMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HoMethodAgent" ADD CONSTRAINT "HoMethodAgent_riskFactorId_fkey" FOREIGN KEY ("riskFactorId") REFERENCES "RiskFactors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "HoMethodEvaluationCondition" ADD CONSTRAINT "HoMethodEvaluationCondition_hoMethodAgentId_fkey" FOREIGN KEY ("hoMethodAgentId") REFERENCES "HoMethodAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill single-agent methods
INSERT INTO "HoMethodAgent" (
    "id",
    "hoMethodId",
    "riskFactorId",
    "agentNameSnapshot",
    "casSnapshot",
    "unitSnapshot",
    "agentType",
    "sortOrder",
    "created_at",
    "updated_at"
)
SELECT
    md5(random()::text || hm."id" || hm."riskFactorId") || substr(md5(clock_timestamp()::text), 1, 8),
    hm."id",
    hm."riskFactorId",
    hm."agentName",
    hm."cas",
    rf."unit",
    hm."agentType",
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "HoMethod" hm
LEFT JOIN "RiskFactors" rf ON rf."id" = hm."riskFactorId"
WHERE hm."riskFactorId" IS NOT NULL
  AND hm."deleted_at" IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "HoMethodAgent" ha
    WHERE ha."hoMethodId" = hm."id"
      AND ha."deleted_at" IS NULL
  );

UPDATE "HoMethodEvaluationCondition" ec
SET "hoMethodAgentId" = ha."id"
FROM "HoMethodAgent" ha
WHERE ec."hoMethodId" = ha."hoMethodId"
  AND ec."hoMethodAgentId" IS NULL
  AND ha."deleted_at" IS NULL;
