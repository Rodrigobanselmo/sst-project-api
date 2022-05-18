/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation,companyId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "abbreviation" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_abbreviation_companyId_key" ON "Workspace"("abbreviation", "companyId");
