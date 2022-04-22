/*
  Warnings:

  - Added the required column `severity` to the `RiskFactors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiskFactors" ADD COLUMN     "severity" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AdmMesures" (
    "id" SERIAL NOT NULL,
    "riskId" INTEGER NOT NULL,
    "recName" TEXT,
    "medName" TEXT,
    "companyId" TEXT NOT NULL,
    "generateSourceId" INTEGER,
    "system" BOOLEAN NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdmMesures_pkey" PRIMARY KEY ("id","companyId")
);

-- CreateTable
CREATE TABLE "Epi" (
    "id" SERIAL NOT NULL,
    "ca" INTEGER NOT NULL,
    "isValid" BOOLEAN,
    "expiredDate" TIMESTAMP(3),
    "desc" TEXT NOT NULL DEFAULT E'',
    "equipment" TEXT NOT NULL DEFAULT E'',
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Epi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Epi_ca_key" ON "Epi"("ca");

-- CreateIndex
CREATE INDEX "Epi_ca_idx" ON "Epi"("ca");

-- CreateIndex
CREATE UNIQUE INDEX "Epi_ca_status_key" ON "Epi"("ca", "status");

-- AddForeignKey
ALTER TABLE "AdmMesures" ADD CONSTRAINT "AdmMesures_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmMesures" ADD CONSTRAINT "AdmMesures_riskId_companyId_fkey" FOREIGN KEY ("riskId", "companyId") REFERENCES "RiskFactors"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmMesures" ADD CONSTRAINT "AdmMesures_generateSourceId_companyId_fkey" FOREIGN KEY ("generateSourceId", "companyId") REFERENCES "GenerateSource"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
