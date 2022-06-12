/*
  Warnings:

  - You are about to drop the column `vision` on the `CompanyEnvironment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyEnvironment" DROP COLUMN "vision",
ADD COLUMN     "photoUrl" TEXT;
