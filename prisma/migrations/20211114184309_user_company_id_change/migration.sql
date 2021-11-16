/*
  Warnings:

  - The primary key for the `UserCompany` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserCompany` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserCompany" DROP CONSTRAINT "UserCompany_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserCompany_pkey" PRIMARY KEY ("companyId", "userId");
