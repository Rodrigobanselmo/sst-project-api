/*
  Warnings:

  - You are about to drop the column `data` on the `ChecklistData` table. All the data in the column will be lost.
  - Added the required column `json` to the `ChecklistData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChecklistData" DROP COLUMN "data",
ADD COLUMN     "json" JSONB NOT NULL;
