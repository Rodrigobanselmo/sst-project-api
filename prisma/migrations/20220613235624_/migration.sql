/*
  Warnings:

  - A unique constraint covering the columns `[cpf,companyId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "admissionDate" TIMESTAMP(3),
ADD COLUMN     "birthday" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_cpf_companyId_key" ON "Employee"("cpf", "companyId");
