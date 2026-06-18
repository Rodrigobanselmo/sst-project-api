-- Snapshot documental por versão e prazo de vigência em DocumentData
ALTER TABLE "RiskFactorDocument" ADD COLUMN "documentCreatedAt" TIMESTAMP(3);
ALTER TABLE "RiskFactorDocument" ADD COLUMN "validityYears" INTEGER;
ALTER TABLE "RiskFactorDocument" ADD COLUMN "validityMonths" INTEGER;
ALTER TABLE "RiskFactorDocument" ADD COLUMN "validityEndSnapshot" TIMESTAMP(3);

ALTER TABLE "DocumentData" ADD COLUMN "validityYears" INTEGER;
ALTER TABLE "DocumentData" ADD COLUMN "validityMonths" INTEGER;
