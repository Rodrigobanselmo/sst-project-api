/*
  Warnings:

  - Made the column `workspaceId` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_companyId_fkey";

-- DropIndex
DROP INDEX "Address_companyId_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "workspaceId" SET NOT NULL;

-- CreateTable
CREATE TABLE "AddressCompany" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "AddressCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AddressCompany_companyId_key" ON "AddressCompany"("companyId");

-- AddForeignKey
ALTER TABLE "AddressCompany" ADD CONSTRAINT "AddressCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
