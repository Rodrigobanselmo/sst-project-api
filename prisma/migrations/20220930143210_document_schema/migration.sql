-- CreateEnum
CREATE TYPE "DocumentTypeEnum" AS ENUM ('PGR', 'PCSMO', 'OTHER');

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "type" "DocumentTypeEnum" NOT NULL DEFAULT 'OTHER',
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "parentDocumentId" INTEGER,
    "companyId" TEXT NOT NULL,
    "workspaceId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_companyId_idx" ON "Document"("companyId");

-- CreateIndex
CREATE INDEX "Document_parentDocumentId_idx" ON "Document"("parentDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_id_companyId_key" ON "Document"("id", "companyId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_workspaceId_companyId_fkey" FOREIGN KEY ("workspaceId", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_parentDocumentId_fkey" FOREIGN KEY ("parentDocumentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
