/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `RiskFactorGroupData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RiskFactorGroupData" DROP CONSTRAINT "RiskFactorGroupData_workspaceId_fkey";

-- AlterTable
ALTER TABLE "RiskFactorGroupData" DROP COLUMN "workspaceId";
