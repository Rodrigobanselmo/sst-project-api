-- AlterEnum
ALTER TYPE "CompanyTypesEnum" ADD VALUE 'CLINIC';

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "isPrincipal" BOOLEAN NOT NULL DEFAULT false;
