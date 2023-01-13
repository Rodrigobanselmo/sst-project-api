/*
  Warnings:

  - You are about to drop the column `nomalized` on the `Cities` table. All the data in the column will be lost.
  - You are about to drop the column `nomalized` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cities" DROP COLUMN "nomalized",
ADD COLUMN     "normalized" TEXT;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "nomalized",
ADD COLUMN     "normalized" TEXT;
