/*
  Warnings:

  - You are about to drop the column `esocialPregress` on the `CompanyReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyReport" DROP COLUMN "esocialPregress",
ADD COLUMN     "esocialProgress" INTEGER NOT NULL DEFAULT 0;
