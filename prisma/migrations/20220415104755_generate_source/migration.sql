-- CreateTable
CREATE TABLE "GenerateSource" (
    "id" SERIAL NOT NULL,
    "riskId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerateSource_pkey" PRIMARY KEY ("id","companyId")
);

-- AddForeignKey
ALTER TABLE "GenerateSource" ADD CONSTRAINT "GenerateSource_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateSource" ADD CONSTRAINT "GenerateSource_riskId_companyId_fkey" FOREIGN KEY ("riskId", "companyId") REFERENCES "RiskFactors"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
