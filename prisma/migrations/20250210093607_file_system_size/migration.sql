/*
  Warnings:

  - Added the required column `size` to the `SystemFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SystemFile" ADD COLUMN     "size" INTEGER NOT NULL;
