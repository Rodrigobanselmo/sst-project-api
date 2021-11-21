/*
  Warnings:

  - Added the required column `lincenseId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "lincenseId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Lincense" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lincense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_lincenseId_fkey" FOREIGN KEY ("lincenseId") REFERENCES "Lincense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
