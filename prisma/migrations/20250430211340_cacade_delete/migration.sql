-- DropForeignKey
ALTER TABLE "RecMedOnRiskData" DROP CONSTRAINT "RecMedOnRiskData_rec_med_id_fkey";

-- DropForeignKey
ALTER TABLE "RecMedOnRiskData" DROP CONSTRAINT "RecMedOnRiskData_risk_data_id_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorDataRec" DROP CONSTRAINT "RiskFactorDataRec_recMedId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorDataRec" DROP CONSTRAINT "RiskFactorDataRec_riskFactorDataId_fkey";

-- AddForeignKey
ALTER TABLE "RiskFactorDataRec" ADD CONSTRAINT "RiskFactorDataRec_recMedId_fkey" FOREIGN KEY ("recMedId") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDataRec" ADD CONSTRAINT "RiskFactorDataRec_riskFactorDataId_fkey" FOREIGN KEY ("riskFactorDataId") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMedOnRiskData" ADD CONSTRAINT "RecMedOnRiskData_rec_med_id_fkey" FOREIGN KEY ("rec_med_id") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMedOnRiskData" ADD CONSTRAINT "RecMedOnRiskData_risk_data_id_fkey" FOREIGN KEY ("risk_data_id") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
