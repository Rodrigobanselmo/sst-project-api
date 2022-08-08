/*
  Warnings:

  - The values [CLINIC] on the enum `CompanyTypesEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanyTypesEnum_new" AS ENUM ('MATRIZ', 'FILIAL', 'MASTER');
ALTER TABLE "Company" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Company" ALTER COLUMN "type" TYPE "CompanyTypesEnum_new" USING ("type"::text::"CompanyTypesEnum_new");
ALTER TYPE "CompanyTypesEnum" RENAME TO "CompanyTypesEnum_old";
ALTER TYPE "CompanyTypesEnum_new" RENAME TO "CompanyTypesEnum";
DROP TYPE "CompanyTypesEnum_old";
ALTER TABLE "Company" ALTER COLUMN "type" SET DEFAULT 'MATRIZ';
COMMIT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "isClinic" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "cnpj" DROP NOT NULL;
