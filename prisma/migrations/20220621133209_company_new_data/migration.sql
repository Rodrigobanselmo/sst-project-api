/*
  Warnings:

  - You are about to drop the column `operatonTime` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "operatonTime",
ADD COLUMN     "operationTime" TEXT,
ADD COLUMN     "shortName" TEXT;
