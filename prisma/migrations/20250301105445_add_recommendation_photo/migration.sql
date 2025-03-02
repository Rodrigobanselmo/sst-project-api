-- CreateTable
CREATE TABLE "RiskFactorDataRecPhoto" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_vertical" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "risk_data_rec_id" TEXT NOT NULL,

    CONSTRAINT "RiskFactorDataRecPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RiskFactorDataRecPhoto" ADD CONSTRAINT "RiskFactorDataRecPhoto_risk_data_rec_id_fkey" FOREIGN KEY ("risk_data_rec_id") REFERENCES "RiskFactorDataRec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
