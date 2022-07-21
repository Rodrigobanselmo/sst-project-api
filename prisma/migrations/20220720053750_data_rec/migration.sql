/*
  Warnings:

  - A unique constraint covering the columns `[riskFactorDataId,recMedId]` on the table `RiskFactorDataRec` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorDataRec_riskFactorDataId_recMedId_key" ON "RiskFactorDataRec"("riskFactorDataId", "recMedId");
