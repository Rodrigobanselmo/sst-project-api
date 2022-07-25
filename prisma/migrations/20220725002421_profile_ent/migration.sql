-- AlterTable
ALTER TABLE "CompanyCharacterization" ADD COLUMN     "partentId" TEXT,
ADD COLUMN     "profileName" TEXT;

-- AddForeignKey
ALTER TABLE "CompanyCharacterization" ADD CONSTRAINT "CompanyCharacterization_partentId_fkey" FOREIGN KEY ("partentId") REFERENCES "CompanyCharacterization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
