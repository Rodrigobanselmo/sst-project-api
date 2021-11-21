/*
  Warnings:

  - The primary key for the `Contract` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyId` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `recevingServiceCompanyId` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_companyId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_pkey",
DROP COLUMN "companyId",
ADD COLUMN     "recevingServiceCompanyId" TEXT NOT NULL,
ADD CONSTRAINT "Contract_pkey" PRIMARY KEY ("applyingServiceCompanyId", "recevingServiceCompanyId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_recevingServiceCompanyId_fkey" FOREIGN KEY ("recevingServiceCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
