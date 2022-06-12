/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,companyId,id]` on the table `CompanyEnvironment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CompanyEnvironment_workspaceId_companyId_id_key" ON "CompanyEnvironment"("workspaceId", "companyId", "id");
