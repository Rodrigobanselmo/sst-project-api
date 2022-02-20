/*
  Warnings:

  - Added the required column `riskId` to the `RecMed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appendix` to the `RiskFactors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecMed" ADD COLUMN     "riskId" INTEGER NOT NULL,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "RiskFactors" ADD COLUMN     "appendix" TEXT NOT NULL,
ADD COLUMN     "propagation" TEXT[],
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE';

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
