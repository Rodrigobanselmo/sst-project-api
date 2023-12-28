/*
  Warnings:

  - You are about to drop the column `endDate` on the `ExamToRisk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExamToRisk" DROP COLUMN "endDate",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
