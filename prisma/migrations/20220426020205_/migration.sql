/*
  Warnings:

  - The `medType` column on the `RecMed` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RecMed" DROP COLUMN "medType",
ADD COLUMN     "medType" "MeasuresTypeEnum";
