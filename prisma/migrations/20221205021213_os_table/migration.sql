-- CreateTable
CREATE TABLE "CompanyOS" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "socialName" JSONB,
    "med" JSONB,
    "rec" JSONB,
    "obligations" JSONB,
    "prohibitions" JSONB,
    "procedures" JSONB,
    "cipa" JSONB,
    "declaration" JSONB,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyOS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyOS_companyId_key" ON "CompanyOS"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyOS_id_companyId_key" ON "CompanyOS"("id", "companyId");

-- AddForeignKey
ALTER TABLE "CompanyOS" ADD CONSTRAINT "CompanyOS_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
