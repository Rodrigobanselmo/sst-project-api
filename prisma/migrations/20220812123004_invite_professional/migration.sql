/*
  Warnings:

  - A unique constraint covering the columns `[examId,companyId,startDate]` on the table `ExamToClinic` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InviteUsers" ADD COLUMN     "professionalId" INTEGER,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_companies_related" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_companies_related_AB_unique" ON "_companies_related"("A", "B");

-- CreateIndex
CREATE INDEX "_companies_related_B_index" ON "_companies_related"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ExamToClinic_examId_companyId_startDate_key" ON "ExamToClinic"("examId", "companyId", "startDate");

-- AddForeignKey
ALTER TABLE "InviteUsers" ADD CONSTRAINT "InviteUsers_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companies_related" ADD CONSTRAINT "_companies_related_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companies_related" ADD CONSTRAINT "_companies_related_B_fkey" FOREIGN KEY ("B") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
