-- DropForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" DROP CONSTRAINT "CharacterizationPhotoRecommendation_photo_id_fkey";

-- DropForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" DROP CONSTRAINT "CharacterizationPhotoRecommendation_recommendation_id_fkey";

-- DropForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" DROP CONSTRAINT "CharacterizationPhotoRecommendation_risk_data_id_fkey";

-- AddForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" ADD CONSTRAINT "CharacterizationPhotoRecommendation_risk_data_id_fkey" FOREIGN KEY ("risk_data_id") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" ADD CONSTRAINT "CharacterizationPhotoRecommendation_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterizationPhotoRecommendation" ADD CONSTRAINT "CharacterizationPhotoRecommendation_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "CompanyCharacterizationPhoto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
