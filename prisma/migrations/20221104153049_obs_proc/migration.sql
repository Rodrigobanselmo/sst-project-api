/*
  Warnings:

  - You are about to drop the column `obsProc` on the `EmployeeExamsHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeExamsHistory" DROP COLUMN "obsProc";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "obsProc" TEXT;
