/*
  Warnings:

  - You are about to drop the column `abbreviation` on the `Workspace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[short,companyId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Workspace_abbreviation_companyId_key";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "abbreviation",
ADD COLUMN     "short" TEXT NOT NULL DEFAULT E'';

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_short_companyId_key" ON "Workspace"("short", "companyId");
