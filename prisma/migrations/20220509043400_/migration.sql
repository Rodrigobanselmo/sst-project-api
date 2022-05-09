-- DropForeignKey
ALTER TABLE "RiskFactorData" DROP CONSTRAINT "RiskFactorData_hierarchyId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorData" DROP CONSTRAINT "RiskFactorData_homogeneousGroupId_fkey";

-- AddForeignKey
ALTER TABLE "RiskFactorData" ADD CONSTRAINT "RiskFactorData_homogeneousGroupId_fkey" FOREIGN KEY ("homogeneousGroupId") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorData" ADD CONSTRAINT "RiskFactorData_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
