/*
  Warnings:

  - You are about to drop the column `medName` on the `AdmMeasures` table. All the data in the column will be lost.
  - You are about to drop the column `recName` on the `AdmMeasures` table. All the data in the column will be lost.
  - Added the required column `name` to the `AdmMeasures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdmMeasures" DROP COLUMN "medName",
DROP COLUMN "recName",
ADD COLUMN     "name" TEXT NOT NULL;
