-- AlterEnum
ALTER TYPE "EmployeeHierarchyMotiveTypeEnum" ADD VALUE 'SUB_OFFICE';

-- AlterTable
ALTER TABLE "EmployeeESocialEvent" ADD COLUMN     "pppId" INTEGER;

-- AlterTable
ALTER TABLE "RiskFactors" ADD COLUMN     "esocialCode" TEXT;

-- CreateTable
CREATE TABLE "EmployeePPPHistory" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "doneDate" TIMESTAMP(3),
    "status" "StatusEnum" NOT NULL DEFAULT 'DONE',
    "sendEvent" BOOLEAN NOT NULL DEFAULT true,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "EmployeePPPHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_sub_offices_history" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "EmployeePPPHistory_status_idx" ON "EmployeePPPHistory"("status");

-- CreateIndex
CREATE INDEX "EmployeePPPHistory_employeeId_idx" ON "EmployeePPPHistory"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "_sub_offices_history_AB_unique" ON "_sub_offices_history"("A", "B");

-- CreateIndex
CREATE INDEX "_sub_offices_history_B_index" ON "_sub_offices_history"("B");

-- CreateIndex
CREATE INDEX "RiskFactors_esocialCode_idx" ON "RiskFactors"("esocialCode");

-- AddForeignKey
ALTER TABLE "EmployeeESocialEvent" ADD CONSTRAINT "EmployeeESocialEvent_pppId_fkey" FOREIGN KEY ("pppId") REFERENCES "EmployeePPPHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePPPHistory" ADD CONSTRAINT "EmployeePPPHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sub_offices_history" ADD CONSTRAINT "_sub_offices_history_A_fkey" FOREIGN KEY ("A") REFERENCES "EmployeeHierarchyHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sub_offices_history" ADD CONSTRAINT "_sub_offices_history_B_fkey" FOREIGN KEY ("B") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
