/*
  Warnings:

  - You are about to drop the column `hide` on the `CharacterizationPhotoRecommendation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CharacterizationPhotoRecommendation" DROP COLUMN "hide",
ADD COLUMN     "is_visible" BOOLEAN NOT NULL DEFAULT true;
