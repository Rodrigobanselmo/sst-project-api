/*
  Warnings:

  - You are about to drop the column `profileId` on the `CompanyCharacterization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyCharacterization" DROP CONSTRAINT "CompanyCharacterization_profileId_fkey";

-- AlterTable
ALTER TABLE "CompanyCharacterization" DROP COLUMN "profileId",
ADD COLUMN     "profileParentId" TEXT;

-- AddForeignKey
ALTER TABLE "CompanyCharacterization" ADD CONSTRAINT "CompanyCharacterization_profileParentId_fkey" FOREIGN KEY ("profileParentId") REFERENCES "CompanyCharacterization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
