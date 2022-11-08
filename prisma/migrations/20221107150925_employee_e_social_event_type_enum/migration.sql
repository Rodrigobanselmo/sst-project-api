/*
  Warnings:

  - Added the required column `type` to the `EmployeeESocialBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `EmployeeESocialEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeESocialBatch" ADD COLUMN     "type" "EmployeeESocialEventTypeEnum" NOT NULL;

-- AlterTable
ALTER TABLE "EmployeeESocialEvent" ADD COLUMN     "type" "EmployeeESocialEventTypeEnum" NOT NULL;
