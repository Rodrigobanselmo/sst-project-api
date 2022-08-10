/*
  Warnings:

  - The `examMinDuration` column on the `ExamToClinic` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ExamToClinic" DROP COLUMN "examMinDuration",
ADD COLUMN     "examMinDuration" INTEGER;
