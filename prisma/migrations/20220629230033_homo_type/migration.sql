/*
  Warnings:

  - You are about to drop the column `nit` on the `Professional` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "HomoTypeEnum" AS ENUM ('HIERARCHY', 'ENVIRONMENT', 'WORKSTATION');

-- AlterTable
ALTER TABLE "HomogeneousGroup" ADD COLUMN     "type" "HomoTypeEnum";

-- AlterTable
ALTER TABLE "Professional" DROP COLUMN "nit";
