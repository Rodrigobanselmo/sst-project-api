/*
  Warnings:

  - Made the column `medType` on table `RecMed` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RecMed" ALTER COLUMN "medType" SET NOT NULL,
ALTER COLUMN "medType" DROP DEFAULT;
