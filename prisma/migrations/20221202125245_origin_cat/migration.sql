-- AlterTable
ALTER TABLE "Cat" ADD COLUMN     "catOriginId" INTEGER;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_catOriginId_fkey" FOREIGN KEY ("catOriginId") REFERENCES "Cat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
