/*
  Warnings:

  - You are about to drop the column `userId` on the `Professional` table. All the data in the column will be lost.
  - Made the column `companyId` on table `Professional` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Professional" DROP CONSTRAINT "Professional_userId_name_fkey";

-- DropIndex
DROP INDEX "Professional_userId_name_key";

-- AlterTable
ALTER TABLE "Professional" DROP COLUMN "userId",
ADD COLUMN     "cpf" TEXT,
ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "crea" TEXT,
ADD COLUMN     "formation" TEXT[];

-- CreateTable
CREATE TABLE "_RiskFactorGroupDataToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RiskFactorGroupDataToUser_AB_unique" ON "_RiskFactorGroupDataToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RiskFactorGroupDataToUser_B_index" ON "_RiskFactorGroupDataToUser"("B");

-- AddForeignKey
ALTER TABLE "_RiskFactorGroupDataToUser" ADD FOREIGN KEY ("A") REFERENCES "RiskFactorGroupData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RiskFactorGroupDataToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
