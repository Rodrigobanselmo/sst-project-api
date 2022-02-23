/*
  Warnings:

  - The primary key for the `Checklist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `companyId` to the `ChecklistData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChecklistData" DROP CONSTRAINT "ChecklistData_checklistId_fkey";

-- DropIndex
DROP INDEX "ChecklistData_checklistId_key";

-- AlterTable
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_pkey",
ADD CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id", "companyId");

-- AlterTable
ALTER TABLE "ChecklistData" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD CONSTRAINT "ChecklistData_pkey" PRIMARY KEY ("checklistId", "companyId");

-- AddForeignKey
ALTER TABLE "ChecklistData" ADD CONSTRAINT "ChecklistData_checklistId_companyId_fkey" FOREIGN KEY ("checklistId", "companyId") REFERENCES "Checklist"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;
