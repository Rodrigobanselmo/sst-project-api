/*
  Warnings:

  - You are about to drop the column `absenteeism` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `cat` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `esocial` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `isDocuments` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `schedule` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "absenteeism",
DROP COLUMN "cat",
DROP COLUMN "esocial",
DROP COLUMN "isDocuments",
DROP COLUMN "schedule",
ADD COLUMN     "permissions" TEXT[];
