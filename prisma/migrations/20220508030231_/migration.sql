-- AddForeignKey
ALTER TABLE "RiskFactorGroupData" ADD CONSTRAINT "RiskFactorGroupData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorData" ADD CONSTRAINT "RiskFactorData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
