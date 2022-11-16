-- AddForeignKey
ALTER TABLE "RiskFactors" ADD CONSTRAINT "RiskFactors_esocialCode_fkey" FOREIGN KEY ("esocialCode") REFERENCES "EsocialTable24"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
