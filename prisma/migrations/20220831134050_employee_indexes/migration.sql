-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Employee_cpf_idx" ON "Employee" USING HASH ("cpf");

-- CreateIndex
CREATE INDEX "Employee_name_idx" ON "Employee"("name");

-- CreateIndex
CREATE INDEX "Employee_email_idx" ON "Employee"("email");
