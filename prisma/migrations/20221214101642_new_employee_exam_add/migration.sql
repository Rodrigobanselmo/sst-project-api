/*
  Warnings:

  - You are about to drop the column `socialName` on the `CompanyOS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyOS" DROP COLUMN "socialName";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "newExamAdded" TIMESTAMP(3);
