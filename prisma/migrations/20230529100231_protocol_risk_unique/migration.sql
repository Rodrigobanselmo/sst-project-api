/*
  Warnings:

  - A unique constraint covering the columns `[riskId,protocolId,companyId]` on the table `ProtocolToRisk` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProtocolToRisk_riskId_protocolId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProtocolToRisk_riskId_protocolId_companyId_key" ON "ProtocolToRisk"("riskId", "protocolId", "companyId");
