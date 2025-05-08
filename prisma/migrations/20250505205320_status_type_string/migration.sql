/*
  Warnings:

  - Changed the type of `type` on the `Status` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Status" DROP COLUMN "type";
ALTER TABLE "Status" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'CHARACTERIZATION';

-- DropEnum
DROP TYPE "StatusTypeEnum";

-- CreateIndex
CREATE INDEX "Status_type_idx" ON "Status"("type");
