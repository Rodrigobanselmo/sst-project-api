-- CreateTable
CREATE TABLE "CompanyCharacterizationFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "companyCharacterizationId" TEXT NOT NULL,

    CONSTRAINT "CompanyCharacterizationFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyCharacterizationFile" ADD CONSTRAINT "CompanyCharacterizationFile_companyCharacterizationId_fkey" FOREIGN KEY ("companyCharacterizationId") REFERENCES "CompanyCharacterization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
