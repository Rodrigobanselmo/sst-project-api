/*
  Warnings:

  - Changed the type of `type` on the `CompanyEnvironment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CompanyEnvironmentTypesEnum" AS ENUM ('SUPPORT', 'OPERATION', 'ADMINISTRATIVE');

-- AlterTable
ALTER TABLE "CompanyEnvironment" DROP COLUMN "type",
ADD COLUMN     "type" "CompanyEnvironmentTypesEnum" NOT NULL;

-- DropEnum
DROP TYPE "CompanyEmviromentTypesEnum";
