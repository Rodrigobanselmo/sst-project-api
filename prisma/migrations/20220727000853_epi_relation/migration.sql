-- CreateTable
CREATE TABLE "EpiToRiskFactorData" (
    "epiId" INTEGER NOT NULL,
    "riskFactorDataId" TEXT NOT NULL,
    "lifeTimeInDays" TIMESTAMP(3),
    "efficientlyCheck" BOOLEAN NOT NULL DEFAULT false,
    "epcCheck" BOOLEAN NOT NULL DEFAULT false,
    "longPeriodsCheck" BOOLEAN NOT NULL DEFAULT false,
    "validationCheck" BOOLEAN NOT NULL DEFAULT false,
    "tradeSignCheck" BOOLEAN NOT NULL DEFAULT false,
    "sanitationCheck" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceCheck" BOOLEAN NOT NULL DEFAULT false,
    "unstoppedCheck" BOOLEAN NOT NULL DEFAULT false,
    "trainingCheck" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EpiToRiskFactorData_pkey" PRIMARY KEY ("epiId","riskFactorDataId")
);

-- AddForeignKey
ALTER TABLE "EpiToRiskFactorData" ADD CONSTRAINT "EpiToRiskFactorData_riskFactorDataId_fkey" FOREIGN KEY ("riskFactorDataId") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpiToRiskFactorData" ADD CONSTRAINT "EpiToRiskFactorData_epiId_fkey" FOREIGN KEY ("epiId") REFERENCES "Epi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
