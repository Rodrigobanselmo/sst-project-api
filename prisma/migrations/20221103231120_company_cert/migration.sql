-- CreateTable
CREATE TABLE "CompanyCert" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "certificate" TEXT NOT NULL,
    "notAfter" TIMESTAMP(3) NOT NULL,
    "notBefore" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyCert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyCert_companyId_key" ON "CompanyCert"("companyId");

-- AddForeignKey
ALTER TABLE "CompanyCert" ADD CONSTRAINT "CompanyCert_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
