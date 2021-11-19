/*
  Warnings:

  - You are about to drop the `PrimaryActivityOnCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecondaryActivityOnCompany` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PrimaryActivityOnCompany" DROP CONSTRAINT "PrimaryActivityOnCompany_activityId_fkey";

-- DropForeignKey
ALTER TABLE "PrimaryActivityOnCompany" DROP CONSTRAINT "PrimaryActivityOnCompany_companyId_fkey";

-- DropForeignKey
ALTER TABLE "SecondaryActivityOnCompany" DROP CONSTRAINT "SecondaryActivityOnCompany_activityId_fkey";

-- DropForeignKey
ALTER TABLE "SecondaryActivityOnCompany" DROP CONSTRAINT "SecondaryActivityOnCompany_companyId_fkey";

-- DropTable
DROP TABLE "PrimaryActivityOnCompany";

-- DropTable
DROP TABLE "SecondaryActivityOnCompany";

-- CreateTable
CREATE TABLE "_primary_activity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_secondary_activity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_primary_activity_AB_unique" ON "_primary_activity"("A", "B");

-- CreateIndex
CREATE INDEX "_primary_activity_B_index" ON "_primary_activity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_secondary_activity_AB_unique" ON "_secondary_activity"("A", "B");

-- CreateIndex
CREATE INDEX "_secondary_activity_B_index" ON "_secondary_activity"("B");

-- AddForeignKey
ALTER TABLE "_primary_activity" ADD FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_primary_activity" ADD FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondary_activity" ADD FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondary_activity" ADD FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
