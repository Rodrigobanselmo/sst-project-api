-- AlterTable
ALTER TABLE "RiskFactorDocument" ALTER COLUMN "fileUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Attachments" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "riskFactorDocumentId" TEXT,

    CONSTRAINT "Attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_riskFactorDocumentId_fkey" FOREIGN KEY ("riskFactorDocumentId") REFERENCES "RiskFactorDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
