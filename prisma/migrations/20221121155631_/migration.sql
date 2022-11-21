/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,doneDate]` on the table `EmployeePPPHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EmployeeESocialEvent" DROP CONSTRAINT "EmployeeESocialEvent_pppId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeePPPHistory" DROP CONSTRAINT "EmployeePPPHistory_employeeId_fkey";

-- AlterTable
ALTER TABLE "EmployeePPPHistory" ALTER COLUMN "json" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmployeePPPHistory_employeeId_doneDate_key" ON "EmployeePPPHistory"("employeeId", "doneDate");

-- AddForeignKey
ALTER TABLE "EmployeeESocialEvent" ADD CONSTRAINT "EmployeeESocialEvent_pppId_fkey" FOREIGN KEY ("pppId") REFERENCES "EmployeePPPHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePPPHistory" ADD CONSTRAINT "EmployeePPPHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
