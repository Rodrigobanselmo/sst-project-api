-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN     "deduplicationId" TEXT;

-- CreateIndex
CREATE INDEX "EmailLog_deduplicationId_idx" ON "EmailLog"("deduplicationId");
