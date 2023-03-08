/*
  Warnings:

  - The primary key for the `DocumentModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id,companyId]` on the table `DocumentModel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DocumentModel" DROP CONSTRAINT "DocumentModel_pkey",
ADD CONSTRAINT "DocumentModel_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentModel_id_companyId_key" ON "DocumentModel"("id", "companyId");
