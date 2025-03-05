/*
  Warnings:

  - You are about to drop the column `created_at` on the `RiskFactorDataRecPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RiskFactorDataRecPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `RiskFactorDataRecPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `RiskFactorDataRecPhoto` table. All the data in the column will be lost.
  - Added the required column `file_id` to the `RiskFactorDataRecPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiskFactorDataRecPhoto" DROP COLUMN "created_at",
DROP COLUMN "name",
DROP COLUMN "updated_at",
DROP COLUMN "url",
ADD COLUMN     "file_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SystemFile" ADD COLUMN     "metadata" JSONB;

-- AddForeignKey
ALTER TABLE "RiskFactorDataRecPhoto" ADD CONSTRAINT "RiskFactorDataRecPhoto_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "SystemFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
