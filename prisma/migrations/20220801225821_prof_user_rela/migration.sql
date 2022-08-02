/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Professional` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProfessionalTypeEnum" ADD VALUE 'USER';
ALTER TYPE "ProfessionalTypeEnum" ADD VALUE 'OTHER';

-- DropIndex
DROP INDEX "_ProfessionalToRiskFactorGroupData_AB_unique";

-- DropIndex
DROP INDEX "_ProfessionalToRiskFactorGroupData_B_index";

-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "crea" TEXT,
ADD COLUMN     "crm" TEXT,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_ProfessionalToRiskFactorGroupData" ADD COLUMN     "isSigner" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "_ProfessionalToRiskFactorGroupData_pkey" PRIMARY KEY ("B", "A");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_key" ON "Professional"("userId");

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
