/*
  Warnings:

  - You are about to drop the column `environment` on the `EmployeeESocialEvent` table. All the data in the column will be lost.
  - You are about to drop the column `snapshot` on the `EmployeeESocialEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "esocialSend" BOOLEAN;

-- AlterTable
ALTER TABLE "EmployeeESocialBatch" ADD COLUMN     "environment" INTEGER;

-- AlterTable
ALTER TABLE "EmployeeESocialEvent" DROP COLUMN "environment",
DROP COLUMN "snapshot";

-- AlterTable
ALTER TABLE "EmployeeExamsHistory" ADD COLUMN     "isSequential" BOOLEAN;
