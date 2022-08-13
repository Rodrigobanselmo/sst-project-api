/*
  Warnings:

  - You are about to drop the column `certifications` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `formation` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "certifications",
DROP COLUMN "formation";
