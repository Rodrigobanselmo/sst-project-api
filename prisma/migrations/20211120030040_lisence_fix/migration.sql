/*
  Warnings:

  - You are about to drop the column `lincenseId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `Lincense` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `licenseId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_lincenseId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "lincenseId",
ADD COLUMN     "licenseId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Lincense";

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
