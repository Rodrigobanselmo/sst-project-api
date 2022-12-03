-- AlterTable
ALTER TABLE "Cat" ADD COLUMN     "sendEvent" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EmployeeESocialEvent" ADD COLUMN     "catId" INTEGER;

-- AddForeignKey
ALTER TABLE "EmployeeESocialEvent" ADD CONSTRAINT "EmployeeESocialEvent_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Cat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
