-- AlterTable
ALTER TABLE "EmployeeESocialEvent" ALTER COLUMN "eventsDate" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "EmployeeESocialEvent_eventId_idx" ON "EmployeeESocialEvent"("eventId");
