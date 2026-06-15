-- Add structured OSHA and NIOSH occupational limit fields for chemical risk factors.
-- ipvs remains the NIOSH IDLH / IPVS field (no duplication).

ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "nioshRel" TEXT;
ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "nioshStel" TEXT;
ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "nioshCeiling" TEXT;
ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "oshaPel" TEXT;
ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "oshaStel" TEXT;
ALTER TABLE "RiskFactors" ADD COLUMN IF NOT EXISTS "oshaCeiling" TEXT;
