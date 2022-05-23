-- CreateTable
CREATE TABLE "RiskFactorDocument" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'',
    "version" TEXT NOT NULL DEFAULT E'1',
    "companyId" TEXT NOT NULL,
    "riskGroupId" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskFactorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorDocument_id_companyId_key" ON "RiskFactorDocument"("id", "companyId");

-- AddForeignKey
ALTER TABLE "RiskFactorDocument" ADD CONSTRAINT "RiskFactorDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDocument" ADD CONSTRAINT "RiskFactorDocument_riskGroupId_companyId_fkey" FOREIGN KEY ("riskGroupId", "companyId") REFERENCES "RiskFactorGroupData"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
