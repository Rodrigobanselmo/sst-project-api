/*
  Warnings:

  - The `medType` column on the `RecMed` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MeasuresTypeEnum" AS ENUM ('ADM', 'ENG');

-- AlterTable
ALTER TABLE "RecMed" DROP COLUMN "medType",
ADD COLUMN     "medType" "MeasuresTypeEnum" NOT NULL DEFAULT E'ADM';

-- DropEnum
DROP TYPE "MesuresTypeEnum";
