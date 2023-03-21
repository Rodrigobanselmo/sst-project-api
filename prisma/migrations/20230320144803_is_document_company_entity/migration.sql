/*
  Warnings:

  - You are about to drop the column `pcmso` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `pgr` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "pcmso",
DROP COLUMN "pgr",
ADD COLUMN     "isDocuments" BOOLEAN DEFAULT true;
