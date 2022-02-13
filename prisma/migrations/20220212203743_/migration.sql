/*
  Warnings:

  - You are about to drop the column `checklisId` on the `ChecklistData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[checklistId]` on the table `ChecklistData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checklistId` to the `ChecklistData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChecklistData" DROP CONSTRAINT "ChecklistData_checklisId_fkey";

-- DropIndex
DROP INDEX "ChecklistData_checklisId_key";

-- AlterTable
ALTER TABLE "ChecklistData" DROP COLUMN "checklisId",
ADD COLUMN     "checklistId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistData_checklistId_key" ON "ChecklistData"("checklistId");

-- AddForeignKey
ALTER TABLE "ChecklistData" ADD CONSTRAINT "ChecklistData_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
