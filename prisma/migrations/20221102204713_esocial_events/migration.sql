/*
  Warnings:

  - You are about to drop the `EmployeeESocialTransmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EmployeeESocialEventTypeEnum" AS ENUM ('CAT_2210', 'EXAM_2220', 'RISK_2240');

-- AlterEnum
ALTER TYPE "StatusEnum" ADD VALUE 'MODIFIED';

-- DropForeignKey
ALTER TABLE "EmployeeESocialTransmission" DROP CONSTRAINT "EmployeeESocialTransmission_companyId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeESocialTransmission" DROP CONSTRAINT "EmployeeESocialTransmission_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeESocialTransmission" DROP CONSTRAINT "EmployeeESocialTransmission_userTransmissionId_fkey";

-- AlterTable
ALTER TABLE "EmployeeExamsHistory" ADD COLUMN     "obsProc" TEXT,
ADD COLUMN     "sendEvent" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "EmployeeESocialTransmission";

-- DropEnum
DROP TYPE "EmployeeESocialTransmissionTypeEnum";

-- CreateTable
CREATE TABLE "EmployeeESocialBatch" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'PENDING',
    "userTransmissionId" INTEGER,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "EmployeeESocialBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeESocialEvent" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "batchId" INTEGER,
    "environment" INTEGER,
    "eventsDate" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'PENDING',
    "snapshot" JSONB,
    "eventXml" TEXT NOT NULL,
    "responseXml" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "examHistoryId" INTEGER,

    CONSTRAINT "EmployeeESocialEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeESocialBatch_status_idx" ON "EmployeeESocialBatch"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeESocialEvent_examHistoryId_key" ON "EmployeeESocialEvent"("examHistoryId");

-- CreateIndex
CREATE INDEX "EmployeeESocialEvent_status_idx" ON "EmployeeESocialEvent"("status");

-- CreateIndex
CREATE INDEX "EmployeeESocialEvent_eventsDate_idx" ON "EmployeeESocialEvent"("eventsDate");

-- AddForeignKey
ALTER TABLE "EmployeeESocialBatch" ADD CONSTRAINT "EmployeeESocialBatch_userTransmissionId_fkey" FOREIGN KEY ("userTransmissionId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeESocialBatch" ADD CONSTRAINT "EmployeeESocialBatch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeESocialEvent" ADD CONSTRAINT "EmployeeESocialEvent_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "EmployeeESocialBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeESocialEvent" ADD CONSTRAINT "EmployeeESocialEvent_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeESocialEvent" ADD CONSTRAINT "EmployeeESocialEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeESocialEvent" ADD CONSTRAINT "EmployeeESocialEvent_examHistoryId_fkey" FOREIGN KEY ("examHistoryId") REFERENCES "EmployeeExamsHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
