/*
  Warnings:

  - The primary key for the `License` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[companyId]` on the table `License` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_id_fkey";

-- AlterTable
ALTER TABLE "License" DROP CONSTRAINT "License_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "License_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "License_companyId_key" ON "License"("companyId");

-- CreateIndex
CREATE INDEX "License_companyId_idx" ON "License"("companyId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
