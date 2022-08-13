/*
  Warnings:

  - You are about to drop the column `professionalId` on the `InviteUsers` table. All the data in the column will be lost.
  - You are about to drop the column `crea` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `crm` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `councilId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `councilType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `councilUF` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `crea` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `crm` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_companies_related` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[inviteId]` on the table `Professional` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InviteUsers" DROP CONSTRAINT "InviteUsers_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "_companies_related" DROP CONSTRAINT "_companies_related_A_fkey";

-- DropForeignKey
ALTER TABLE "_companies_related" DROP CONSTRAINT "_companies_related_B_fkey";

-- AlterTable
ALTER TABLE "InviteUsers" DROP COLUMN "professionalId";

-- AlterTable
ALTER TABLE "Professional" DROP COLUMN "crea",
DROP COLUMN "crm",
ADD COLUMN     "inviteId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "councilId",
DROP COLUMN "councilType",
DROP COLUMN "councilUF",
DROP COLUMN "crea",
DROP COLUMN "crm";

-- DropTable
DROP TABLE "_companies_related";

-- CreateIndex
CREATE UNIQUE INDEX "Professional_inviteId_key" ON "Professional"("inviteId");

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "InviteUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
