-- AlterTable
ALTER TABLE "EmployeeExamsHistory" ADD COLUMN     "fileUrl" TEXT;

-- CreateIndex
CREATE INDEX "EmployeeExamsHistory_fileUrl_idx" ON "EmployeeExamsHistory"("fileUrl");
