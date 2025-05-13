-- CreateTable
CREATE TABLE "RiskSubType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RiskFactorsEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskSubType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskToRiskSubType" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sub_type_id" INTEGER NOT NULL,
    "risk_id" TEXT NOT NULL,

    CONSTRAINT "RiskToRiskSubType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RiskSubType_type_idx" ON "RiskSubType"("type");

-- AddForeignKey
ALTER TABLE "RiskToRiskSubType" ADD CONSTRAINT "RiskToRiskSubType_sub_type_id_fkey" FOREIGN KEY ("sub_type_id") REFERENCES "RiskSubType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskToRiskSubType" ADD CONSTRAINT "RiskToRiskSubType_risk_id_fkey" FOREIGN KEY ("risk_id") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- insert values 

INSERT INTO "RiskSubType" ("name", "type", "created_at", "updated_at") VALUES
('Psicossociais', 'ERG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);