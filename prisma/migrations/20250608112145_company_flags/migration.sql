-- CreateTable
CREATE TABLE "CompanyFlags" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "action_plan_notifications_enabled" BOOLEAN NOT NULL DEFAULT false,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "CompanyFlags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyFlags_company_id_key" ON "CompanyFlags"("company_id");

-- AddForeignKey
ALTER TABLE "CompanyFlags" ADD CONSTRAINT "CompanyFlags_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
