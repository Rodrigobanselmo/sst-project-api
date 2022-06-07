/*
  Warnings:

  - A unique constraint covering the columns `[riskId,riskFactorGroupDataId]` on the table `RiskFactorData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorData_riskId_riskFactorGroupDataId_key" ON "RiskFactorData"("riskId", "riskFactorGroupDataId");
