/*
  Warnings:

  - The primary key for the `HierarchyOnHomogeneous` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "EmployeeESocialRefTypeEnum" AS ENUM ('CAT', 'EXAM', 'HIERARCHY', 'HOMO_GROUP', 'RISK_DATA', 'SUB_OFFICE');

-- CreateEnum
CREATE TYPE "EmployeeESocialTransmissionTypeEnum" AS ENUM ('CAT_2210', 'EXAM_2220', 'RISK_2240');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "esocialLastTransmission" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "HierarchyOnHomogeneous" DROP CONSTRAINT "HierarchyOnHomogeneous_pkey",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD CONSTRAINT "HierarchyOnHomogeneous_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RiskFactorData" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EmployeeESocialTransmission" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "refType" "EmployeeESocialRefTypeEnum" NOT NULL,
    "refId" TEXT NOT NULL,
    "eventsDate" TIMESTAMP(3) NOT NULL,
    "eventsType" "EmployeeESocialTransmissionTypeEnum" NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'DONE',
    "userTransmissionId" INTEGER,
    "employeeId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "EmployeeESocialTransmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Protocol" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocolToRisk" (
    "id" SERIAL NOT NULL,
    "protocolId" INTEGER,
    "riskId" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "ProtocolToRisk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeESocialTransmission_refType_idx" ON "EmployeeESocialTransmission"("refType");

-- CreateIndex
CREATE INDEX "EmployeeESocialTransmission_refId_idx" ON "EmployeeESocialTransmission"("refId");

-- CreateIndex
CREATE INDEX "EmployeeESocialTransmission_status_idx" ON "EmployeeESocialTransmission"("status");

-- CreateIndex
CREATE INDEX "EmployeeESocialTransmission_eventsDate_idx" ON "EmployeeESocialTransmission"("eventsDate");

-- CreateIndex
CREATE UNIQUE INDEX "Protocol_id_companyId_key" ON "Protocol"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProtocolToRisk_id_companyId_key" ON "ProtocolToRisk"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProtocolToRisk_riskId_protocolId_key" ON "ProtocolToRisk"("riskId", "protocolId");

-- CreateIndex
CREATE INDEX "HierarchyOnHomogeneous_endDate_idx" ON "HierarchyOnHomogeneous"("endDate");

-- AddForeignKey
ALTER TABLE "EmployeeESocialTransmission" ADD CONSTRAINT "EmployeeESocialTransmission_userTransmissionId_fkey" FOREIGN KEY ("userTransmissionId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeESocialTransmission" ADD CONSTRAINT "EmployeeESocialTransmission_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeESocialTransmission" ADD CONSTRAINT "EmployeeESocialTransmission_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol" ADD CONSTRAINT "Protocol_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolToRisk" ADD CONSTRAINT "ProtocolToRisk_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolToRisk" ADD CONSTRAINT "ProtocolToRisk_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "RiskFactors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolToRisk" ADD CONSTRAINT "ProtocolToRisk_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
