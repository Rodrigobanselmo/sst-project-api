-- AIHA WEEL occupational limit fields for chemical risk factors.

ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "aihaWeel" TEXT;
ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "aihaWeelCeiling" TEXT;
