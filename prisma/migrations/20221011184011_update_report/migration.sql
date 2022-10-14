-- DropIndex
DROP INDEX "CompanyReport_id_companyId_key";

-- CreateIndex
CREATE INDEX "CompanyReport_companyId_idx" ON "CompanyReport"("companyId");
