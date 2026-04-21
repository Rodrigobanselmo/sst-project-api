-- CreateTable
CREATE TABLE "RiskFactorDataRecDerivedMeasure" (
    "id" TEXT NOT NULL,
    "riskFactorDataRecId" TEXT NOT NULL,
    "sourceRecMedId" TEXT NOT NULL,
    "derivedRecMedId" TEXT NOT NULL,
    "riskFactorDataId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "destinationMedType" "MeasuresTypeEnum" NOT NULL,
    "sourceRecType" "RecTypeEnum",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskFactorDataRecDerivedMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorDataRecDerivedMeasure_riskFactorDataRecId_key" ON "RiskFactorDataRecDerivedMeasure"("riskFactorDataRecId");

CREATE UNIQUE INDEX "RiskFactorDataRecDerivedMeasure_riskFactorDataId_sourceRecMedId_workspaceId_key" ON "RiskFactorDataRecDerivedMeasure"("riskFactorDataId", "sourceRecMedId", "workspaceId");

-- AddForeignKey
ALTER TABLE "RiskFactorDataRecDerivedMeasure" ADD CONSTRAINT "RiskFactorDataRecDerivedMeasure_riskFactorDataRecId_fkey" FOREIGN KEY ("riskFactorDataRecId") REFERENCES "RiskFactorDataRec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RiskFactorDataRecDerivedMeasure" ADD CONSTRAINT "RiskFactorDataRecDerivedMeasure_sourceRecMedId_fkey" FOREIGN KEY ("sourceRecMedId") REFERENCES "RecMed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "RiskFactorDataRecDerivedMeasure" ADD CONSTRAINT "RiskFactorDataRecDerivedMeasure_derivedRecMedId_fkey" FOREIGN KEY ("derivedRecMedId") REFERENCES "RecMed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "RiskFactorDataRecDerivedMeasure" ADD CONSTRAINT "RiskFactorDataRecDerivedMeasure_riskFactorDataId_fkey" FOREIGN KEY ("riskFactorDataId") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RiskFactorDataRecDerivedMeasure" ADD CONSTRAINT "RiskFactorDataRecDerivedMeasure_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RiskFactorDataRecDerivedMeasure" ADD CONSTRAINT "RiskFactorDataRecDerivedMeasure_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
