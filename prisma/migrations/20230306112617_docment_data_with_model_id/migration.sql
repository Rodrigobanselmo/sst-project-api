-- AlterTable
ALTER TABLE "DocumentData" ADD COLUMN     "modelId" INTEGER;

-- AddForeignKey
ALTER TABLE "DocumentData" ADD CONSTRAINT "DocumentData_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "DocumentModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
