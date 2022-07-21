/*
  Warnings:

  - A unique constraint covering the columns `[riskFactorDataId,recMedId,companyId]` on the table `RiskFactorDataRec` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `RiskFactorDataRec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `RiskFactorDataRec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `RiskFactorDataRecComments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RiskFactorDataRec_riskFactorDataId_recMedId_key";

-- AlterTable
ALTER TABLE "RiskFactorDataRec" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "RiskFactorDataRecComments" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorDataRec_riskFactorDataId_recMedId_companyId_key" ON "RiskFactorDataRec"("riskFactorDataId", "recMedId", "companyId");

-- AddForeignKey
ALTER TABLE "RiskFactorDataRec" ADD CONSTRAINT "RiskFactorDataRec_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
