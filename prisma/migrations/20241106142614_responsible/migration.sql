/*
  Warnings:

  - Added the required column `responsibleId` to the `RiskFactorDataRec` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiskFactorDataRec" ADD COLUMN     "responsibleId" INTEGER;

-- CreateIndex
CREATE INDEX "Hierarchy_parentId_idx" ON "Hierarchy"("parentId");

-- AddForeignKey
ALTER TABLE "RiskFactorDataRec" ADD CONSTRAINT "RiskFactorDataRec_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
