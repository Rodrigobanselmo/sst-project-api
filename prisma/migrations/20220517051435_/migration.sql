/*
  Warnings:

  - You are about to drop the column `short` on the `Workspace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,companyId]` on the table `Hierarchy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[abbreviation,companyId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Workspace_short_companyId_key";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "short",
ADD COLUMN     "abbreviation" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Hierarchy_id_companyId_key" ON "Hierarchy"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_abbreviation_companyId_key" ON "Workspace"("abbreviation", "companyId");
