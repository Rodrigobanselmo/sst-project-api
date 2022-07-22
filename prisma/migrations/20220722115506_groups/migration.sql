/*
  Warnings:

  - A unique constraint covering the columns `[id,companyId]` on the table `AccessGroups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,companyId]` on the table `CompanyGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `AccessGroups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `AccessGroups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `CompanyGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessGroups" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "system" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CompanyGroup" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InviteUsers" ADD COLUMN     "groupId" INTEGER;

-- AlterTable
ALTER TABLE "UserCompany" ADD COLUMN     "groupId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "AccessGroups_id_companyId_key" ON "AccessGroups"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyGroup_id_companyId_key" ON "CompanyGroup"("id", "companyId");

-- AddForeignKey
ALTER TABLE "AccessGroups" ADD CONSTRAINT "AccessGroups_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyGroup" ADD CONSTRAINT "CompanyGroup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteUsers" ADD CONSTRAINT "InviteUsers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "AccessGroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "AccessGroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
