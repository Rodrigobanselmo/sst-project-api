-- CreateTable
CREATE TABLE "CharacterizationPhotoRecommendation" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hide" BOOLEAN NOT NULL DEFAULT false,
    "risk_data_id" TEXT NOT NULL,
    "recommendation_id" TEXT NOT NULL,
    "photo_id" TEXT NOT NULL,

    CONSTRAINT "CharacterizationPhotoRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterizationPhotoRecommendation_risk_data_id_recommenda_key" ON "CharacterizationPhotoRecommendation"("risk_data_id", "recommendation_id", "photo_id");

-- AddForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" ADD CONSTRAINT "CharacterizationPhotoRecommendation_risk_data_id_fkey" FOREIGN KEY ("risk_data_id") REFERENCES "RiskFactorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" ADD CONSTRAINT "CharacterizationPhotoRecommendation_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "RecMed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" ADD CONSTRAINT "CharacterizationPhotoRecommendation_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "CompanyCharacterizationPhoto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
