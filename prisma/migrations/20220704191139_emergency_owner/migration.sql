/*
  Warnings:

  - You are about to drop the column `emergency` on the `RiskFactors` table. All the data in the column will be lost.
  - You are about to drop the column `isAnotherOwner` on the `Workspace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RiskFactors" DROP COLUMN "emergency",
ADD COLUMN     "isEmergency" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "isAnotherOwner",
ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT true;
