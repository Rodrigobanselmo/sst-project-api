/*
  Warnings:

  - The primary key for the `RiskFactors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id,companyId]` on the table `RiskFactors` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RiskFactors" DROP CONSTRAINT "RiskFactors_pkey",
ADD CONSTRAINT "RiskFactors_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactors_id_companyId_key" ON "RiskFactors"("id", "companyId");
