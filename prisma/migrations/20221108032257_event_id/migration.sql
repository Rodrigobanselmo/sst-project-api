-- AlterTable
ALTER TABLE "EmployeeESocialBatch" ADD COLUMN     "protocolId" TEXT;

-- AlterTable
ALTER TABLE "EmployeeESocialEvent" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "receipt" TEXT;
