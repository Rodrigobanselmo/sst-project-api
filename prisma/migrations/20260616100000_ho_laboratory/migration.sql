CREATE TYPE "HoLaboratoryStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TABLE "HoLaboratory" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT,
    "corporateName" TEXT NOT NULL,
    "tradeName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "contactName" TEXT,
    "notes" TEXT,
    "status" "HoLaboratoryStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "HoLaboratory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HoLaboratory_cnpj_key" ON "HoLaboratory"("cnpj");
CREATE INDEX "HoLaboratory_corporateName_idx" ON "HoLaboratory"("corporateName");
CREATE INDEX "HoLaboratory_tradeName_idx" ON "HoLaboratory"("tradeName");
CREATE INDEX "HoLaboratory_status_idx" ON "HoLaboratory"("status");

ALTER TABLE "HoMethodLaboratory" ADD COLUMN IF NOT EXISTS "laboratoryId" TEXT;

CREATE INDEX IF NOT EXISTS "HoMethodLaboratory_laboratoryId_idx" ON "HoMethodLaboratory"("laboratoryId");

ALTER TABLE "HoMethodLaboratory"
ADD CONSTRAINT "HoMethodLaboratory_laboratoryId_fkey"
FOREIGN KEY ("laboratoryId") REFERENCES "HoLaboratory"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
