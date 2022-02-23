/*
  Warnings:

  - The `type` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `License` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `License` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanyTypesEnum" AS ENUM ('MATRIZ', 'FILIAL');

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_licenseId_fkey";

-- DropIndex
DROP INDEX "License_companyId_idx";

-- DropIndex
DROP INDEX "License_companyId_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "type",
ADD COLUMN     "type" "CompanyTypesEnum" NOT NULL DEFAULT E'MATRIZ';

-- AlterTable
ALTER TABLE "License" DROP CONSTRAINT "License_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "License_pkey" PRIMARY KEY ("companyId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_id_fkey" FOREIGN KEY ("id") REFERENCES "License"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
