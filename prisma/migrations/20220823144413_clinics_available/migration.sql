-- CreateTable
CREATE TABLE "CompanyClinics" (
    "companyId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyClinics_pkey" PRIMARY KEY ("companyId","clinicId")
);

-- AddForeignKey
ALTER TABLE "CompanyClinics" ADD CONSTRAINT "CompanyClinics_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyClinics" ADD CONSTRAINT "CompanyClinics_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
