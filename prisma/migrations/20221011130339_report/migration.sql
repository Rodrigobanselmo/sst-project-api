-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "expiredDateExam" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CompanyReport" (
    "id" SERIAL NOT NULL,
    "lastDailyReport" TIMESTAMP(3),
    "dailyReport" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyReport_companyId_key" ON "CompanyReport"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyReport_id_companyId_key" ON "CompanyReport"("id", "companyId");

-- AddForeignKey
ALTER TABLE "CompanyReport" ADD CONSTRAINT "CompanyReport_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
