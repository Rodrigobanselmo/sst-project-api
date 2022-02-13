-- CreateEnum
CREATE TYPE "RiskFactorsEnum" AS ENUM ('BIO', 'QUI', 'FIS', 'ERG', 'ACI');

-- CreateTable
CREATE TABLE "RiskFactors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL,
    "type" "RiskFactorsEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskFactors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecMed" (
    "id" SERIAL NOT NULL,
    "recName" TEXT NOT NULL,
    "medName" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecMed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RiskFactors" ADD CONSTRAINT "RiskFactors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
