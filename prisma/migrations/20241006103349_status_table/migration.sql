-- CreateEnum
CREATE TYPE "StatusTypeEnum" AS ENUM ('CHARACTERIZATION');

-- AlterTable
ALTER TABLE "CompanyCharacterization" ADD COLUMN     "stageId" INTEGER;

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StatusTypeEnum" NOT NULL,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Status_type_idx" ON "Status"("type");

-- CreateIndex
CREATE INDEX "CompanyCharacterization_companyId_idx" ON "CompanyCharacterization"("companyId");

-- CreateIndex
CREATE INDEX "CompanyCharacterization_name_idx" ON "CompanyCharacterization"("name");

-- CreateIndex
CREATE INDEX "CompanyCharacterization_status_idx" ON "CompanyCharacterization"("status");

-- AddForeignKey
ALTER TABLE "CompanyCharacterization" ADD CONSTRAINT "CompanyCharacterization_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
