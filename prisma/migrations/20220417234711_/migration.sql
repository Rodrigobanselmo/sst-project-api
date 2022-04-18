/*
  Warnings:

  - Added the required column `generateSourceId` to the `RecMed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecMed" ADD COLUMN     "generateSourceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_generateSourceId_companyId_fkey" FOREIGN KEY ("generateSourceId", "companyId") REFERENCES "GenerateSource"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
