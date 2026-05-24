-- CreateEnum
CREATE TYPE "FormApplicationScopeTypeEnum" AS ENUM ('COMPANY_WORKSPACES', 'BUSINESS_GROUP_COMPANIES');

-- AlterTable
ALTER TABLE "FormApplication"
ADD COLUMN "scope_type" "FormApplicationScopeTypeEnum" NOT NULL DEFAULT 'COMPANY_WORKSPACES',
ADD COLUMN "company_group_id" INTEGER;

-- CreateTable
CREATE TABLE "FormApplicationCompany" (
    "id" TEXT NOT NULL,
    "form_application_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormApplicationCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormApplication_company_group_id_idx" ON "FormApplication"("company_group_id");

-- CreateIndex
CREATE INDEX "FormApplicationCompany_form_application_id_idx" ON "FormApplicationCompany"("form_application_id");

-- CreateIndex
CREATE INDEX "FormApplicationCompany_company_id_idx" ON "FormApplicationCompany"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "FormApplicationCompany_form_application_id_company_id_key" ON "FormApplicationCompany"("form_application_id", "company_id");

-- AddForeignKey
ALTER TABLE "FormApplication" ADD CONSTRAINT "FormApplication_company_group_id_fkey" FOREIGN KEY ("company_group_id") REFERENCES "CompanyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApplicationCompany" ADD CONSTRAINT "FormApplicationCompany_form_application_id_fkey" FOREIGN KEY ("form_application_id") REFERENCES "FormApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApplicationCompany" ADD CONSTRAINT "FormApplicationCompany_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
