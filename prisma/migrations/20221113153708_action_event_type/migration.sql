-- CreateEnum
CREATE TYPE "EmployeeESocialEventActionEnum" AS ENUM ('SEND', 'EXCLUDE', 'MODIFY');

-- AlterTable
ALTER TABLE "EmployeeESocialEvent" ADD COLUMN     "action" "EmployeeESocialEventActionEnum";
