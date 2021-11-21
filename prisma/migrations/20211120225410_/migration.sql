/*
  Warnings:

  - The primary key for the `Contract` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ownerCompanyId` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `applyingServiceCompanyId` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_ownerCompanyId_fkey";

-- DropIndex
DROP INDEX "Contract_companyId_key";

-- AlterTable
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_pkey",
DROP COLUMN "ownerCompanyId",
ADD COLUMN     "applyingServiceCompanyId" TEXT NOT NULL,
ADD CONSTRAINT "Contract_pkey" PRIMARY KEY ("applyingServiceCompanyId", "companyId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_applyingServiceCompanyId_fkey" FOREIGN KEY ("applyingServiceCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
