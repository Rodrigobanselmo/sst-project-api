/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `License` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `License` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "License" ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "License_companyId_key" ON "License"("companyId");
