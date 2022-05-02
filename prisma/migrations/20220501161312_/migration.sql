/*
  Warnings:

  - You are about to drop the column `fabrication` on the `Epi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Epi" DROP COLUMN "fabrication",
ADD COLUMN     "national" BOOLEAN NOT NULL DEFAULT true;
