-- AlterTable
ALTER TABLE "RiskFactorData" ADD COLUMN     "level" INTEGER;

-- CreateTable
CREATE TABLE "RiskFactorDataRec" (
    "id" TEXT NOT NULL,
    "responsibleName" TEXT,
    "endDate" TIMESTAMP(3),
    "comment" TEXT,
    "status" "StatusEnum" NOT NULL DEFAULT E'PENDING',
    "recMedId" TEXT NOT NULL,
    "riskFactorDataId" TEXT NOT NULL,

    CONSTRAINT "RiskFactorDataRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RiskFactorDataRec" ADD CONSTRAINT "RiskFactorDataRec_recMedId_fkey" FOREIGN KEY ("recMedId") REFERENCES "RecMed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDataRec" ADD CONSTRAINT "RiskFactorDataRec_riskFactorDataId_fkey" FOREIGN KEY ("riskFactorDataId") REFERENCES "RiskFactorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
