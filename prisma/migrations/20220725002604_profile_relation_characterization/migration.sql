/*
  Warnings:

  - You are about to drop the column `partentId` on the `CompanyCharacterization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyCharacterization" DROP CONSTRAINT "CompanyCharacterization_partentId_fkey";

-- AlterTable
ALTER TABLE "CompanyCharacterization" DROP COLUMN "partentId",
ADD COLUMN     "profileId" TEXT;

-- AddForeignKey
ALTER TABLE "CompanyCharacterization" ADD CONSTRAINT "CompanyCharacterization_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "CompanyCharacterization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
