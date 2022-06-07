/*
  Warnings:

  - A unique constraint covering the columns `[homogeneousGroupId,riskId,riskFactorGroupDataId]` on the table `RiskFactorData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hierarchyId,riskId,riskFactorGroupDataId]` on the table `RiskFactorData` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RiskFactorData_riskId_riskFactorGroupDataId_key";

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorData_homogeneousGroupId_riskId_riskFactorGroupDat_key" ON "RiskFactorData"("homogeneousGroupId", "riskId", "riskFactorGroupDataId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorData_hierarchyId_riskId_riskFactorGroupDataId_key" ON "RiskFactorData"("hierarchyId", "riskId", "riskFactorGroupDataId");
