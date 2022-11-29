/*
  Warnings:

  - You are about to drop the column `ideOC` on the `Cat` table. All the data in the column will be lost.
  - You are about to drop the column `nmEmit` on the `Cat` table. All the data in the column will be lost.
  - You are about to drop the column `nrOC` on the `Cat` table. All the data in the column will be lost.
  - You are about to drop the column `ufOC` on the `Cat` table. All the data in the column will be lost.
  - Added the required column `timeSpent` to the `Absenteeism` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeUnit` to the `Absenteeism` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docId` to the `Cat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DateUnitEnum" AS ENUM ('DAY', 'HOUR', 'MINUTE');

-- AlterTable
ALTER TABLE "Absenteeism" ADD COLUMN     "docId" INTEGER,
ADD COLUMN     "isExtern" BOOLEAN,
ADD COLUMN     "isJustified" BOOLEAN,
ADD COLUMN     "local" TEXT,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "timeSpent" INTEGER NOT NULL,
ADD COLUMN     "timeUnit" "DateUnitEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Cat" DROP COLUMN "ideOC",
DROP COLUMN "nmEmit",
DROP COLUMN "nrOC",
DROP COLUMN "ufOC",
ADD COLUMN     "docId" INTEGER NOT NULL,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "Absenteeism" ADD CONSTRAINT "Absenteeism_docId_fkey" FOREIGN KEY ("docId") REFERENCES "ProfessionalCouncil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_docId_fkey" FOREIGN KEY ("docId") REFERENCES "ProfessionalCouncil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
