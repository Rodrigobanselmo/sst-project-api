/*
  Warnings:

  - You are about to drop the `_recs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_recs" DROP CONSTRAINT "_recs_A_fkey";

-- DropForeignKey
ALTER TABLE "_recs" DROP CONSTRAINT "_recs_B_fkey";

-- AlterTable
ALTER TABLE "RecMedOnRiskData" ALTER COLUMN "sequential_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SystemFile" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "_recs";

-- RenameForeignKey
ALTER TABLE "RecMedOnRiskData" RENAME CONSTRAINT "RecMedOnRiskData_A_fkey" TO "RecMedOnRiskData_rec_med_id_fkey";

-- RenameForeignKey
ALTER TABLE "RecMedOnRiskData" RENAME CONSTRAINT "RecMedOnRiskData_B_fkey" TO "RecMedOnRiskData_risk_data_id_fkey";
