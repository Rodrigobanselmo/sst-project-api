-- DropForeignKey
ALTER TABLE "RiskFactorDataRecComments" DROP CONSTRAINT "RiskFactorDataRecComments_riskFactorDataRecId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFactorDataRecPhoto" DROP CONSTRAINT "RiskFactorDataRecPhoto_risk_data_rec_id_fkey";

-- AddForeignKey
ALTER TABLE "RiskFactorDataRecPhoto" ADD CONSTRAINT "RiskFactorDataRecPhoto_risk_data_rec_id_fkey" FOREIGN KEY ("risk_data_rec_id") REFERENCES "RiskFactorDataRec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDataRecComments" ADD CONSTRAINT "RiskFactorDataRecComments_riskFactorDataRecId_fkey" FOREIGN KEY ("riskFactorDataRecId") REFERENCES "RiskFactorDataRec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
