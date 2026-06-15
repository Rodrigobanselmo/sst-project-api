-- Dedicated ACGIH Ceiling field for chemical risk factors.

ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "acgihCeiling" TEXT;
