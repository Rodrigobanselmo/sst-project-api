/*
  Warnings:

  - The primary key for the `Contract` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recevingServiceCompanyId` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `receivingServiceCompanyId` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_recevingServiceCompanyId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_pkey",
DROP COLUMN "recevingServiceCompanyId",
ADD COLUMN     "receivingServiceCompanyId" TEXT NOT NULL,
ADD CONSTRAINT "Contract_pkey" PRIMARY KEY ("applyingServiceCompanyId", "receivingServiceCompanyId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_receivingServiceCompanyId_fkey" FOREIGN KEY ("receivingServiceCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
