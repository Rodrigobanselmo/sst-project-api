/*
  Warnings:

  - You are about to drop the column `councilId` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `councilType` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `councilUF` on the `Professional` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Professional" DROP COLUMN "councilId",
DROP COLUMN "councilType",
DROP COLUMN "councilUF";
