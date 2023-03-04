-- CreateTable
CREATE TABLE "DocumentModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "DocumentTypeEnum" NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "DocumentModel_pkey" PRIMARY KEY ("id","companyId")
);

-- AddForeignKey
ALTER TABLE "DocumentModel" ADD CONSTRAINT "DocumentModel_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
