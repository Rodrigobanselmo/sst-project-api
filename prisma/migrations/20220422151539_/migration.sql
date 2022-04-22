/*
  Warnings:

  - You are about to drop the `AdmMesures` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdmMesures" DROP CONSTRAINT "AdmMesures_companyId_fkey";

-- DropForeignKey
ALTER TABLE "AdmMesures" DROP CONSTRAINT "AdmMesures_generateSourceId_companyId_fkey";

-- DropForeignKey
ALTER TABLE "AdmMesures" DROP CONSTRAINT "AdmMesures_riskId_companyId_fkey";

-- DropTable
DROP TABLE "AdmMesures";

-- CreateTable
CREATE TABLE "AdmMeasures" (
    "id" SERIAL NOT NULL,
    "riskId" INTEGER NOT NULL,
    "recName" TEXT,
    "medName" TEXT,
    "companyId" TEXT NOT NULL,
    "generateSourceId" INTEGER,
    "system" BOOLEAN NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdmMeasures_pkey" PRIMARY KEY ("id","companyId")
);

-- AddForeignKey
ALTER TABLE "AdmMeasures" ADD CONSTRAINT "AdmMeasures_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmMeasures" ADD CONSTRAINT "AdmMeasures_riskId_companyId_fkey" FOREIGN KEY ("riskId", "companyId") REFERENCES "RiskFactors"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmMeasures" ADD CONSTRAINT "AdmMeasures_generateSourceId_companyId_fkey" FOREIGN KEY ("generateSourceId", "companyId") REFERENCES "GenerateSource"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
