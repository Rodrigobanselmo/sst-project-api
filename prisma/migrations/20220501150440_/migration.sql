/*
  Warnings:

  - You are about to drop the column `desc` on the `Epi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Epi" DROP COLUMN "desc",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'';
