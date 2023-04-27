-- DropForeignKey
ALTER TABLE "ProtocolToRisk" DROP CONSTRAINT "ProtocolToRisk_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ProtocolToRisk" DROP CONSTRAINT "ProtocolToRisk_protocolId_fkey";

-- DropForeignKey
ALTER TABLE "ProtocolToRisk" DROP CONSTRAINT "ProtocolToRisk_riskId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorsDocInfo" DROP CONSTRAINT "RiskFactorsDocInfo_hierarchyId_fkey";

-- AddForeignKey
ALTER TABLE "ProtocolToRisk" ADD CONSTRAINT "ProtocolToRisk_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolToRisk" ADD CONSTRAINT "ProtocolToRisk_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolToRisk" ADD CONSTRAINT "ProtocolToRisk_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorsDocInfo" ADD CONSTRAINT "RiskFactorsDocInfo_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
