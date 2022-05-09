/*
  Warnings:

  - You are about to drop the `_RecMedToRiskFactorData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RecMedToRiskFactorData" DROP CONSTRAINT "_RecMedToRiskFactorData_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecMedToRiskFactorData" DROP CONSTRAINT "_RecMedToRiskFactorData_B_fkey";

-- DropTable
DROP TABLE "_RecMedToRiskFactorData";

-- CreateTable
CREATE TABLE "_recs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_engs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_adms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_recs_AB_unique" ON "_recs"("A", "B");

-- CreateIndex
CREATE INDEX "_recs_B_index" ON "_recs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_engs_AB_unique" ON "_engs"("A", "B");

-- CreateIndex
CREATE INDEX "_engs_B_index" ON "_engs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_adms_AB_unique" ON "_adms"("A", "B");

-- CreateIndex
CREATE INDEX "_adms_B_index" ON "_adms"("B");

-- AddForeignKey
ALTER TABLE "_recs" ADD FOREIGN KEY ("A") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_recs" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_engs" ADD FOREIGN KEY ("A") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_engs" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_adms" ADD FOREIGN KEY ("A") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_adms" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
