/*
  Warnings:

  - The primary key for the `Checklist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ChecklistData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyId` on the `ChecklistData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[checklistId]` on the table `ChecklistData` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ChecklistData" DROP CONSTRAINT "ChecklistData_checklistId_companyId_fkey";

-- AlterTable
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_pkey",
ADD CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChecklistData" DROP CONSTRAINT "ChecklistData_pkey",
DROP COLUMN "companyId";

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistData_checklistId_key" ON "ChecklistData"("checklistId");

-- AddForeignKey
ALTER TABLE "ChecklistData" ADD CONSTRAINT "ChecklistData_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
