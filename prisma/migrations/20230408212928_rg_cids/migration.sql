/*
  Warnings:

  - You are about to drop the column `cidId` on the `Employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_cidId_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "cidId",
ADD COLUMN     "isPCD" BOOLEAN DEFAULT false,
ADD COLUMN     "rg" TEXT;

-- CreateTable
CREATE TABLE "_CidToEmployee" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CidToEmployee_AB_unique" ON "_CidToEmployee"("A", "B");

-- CreateIndex
CREATE INDEX "_CidToEmployee_B_index" ON "_CidToEmployee"("B");

-- AddForeignKey
ALTER TABLE "_CidToEmployee" ADD CONSTRAINT "_CidToEmployee_A_fkey" FOREIGN KEY ("A") REFERENCES "Cid"("cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CidToEmployee" ADD CONSTRAINT "_CidToEmployee_B_fkey" FOREIGN KEY ("B") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
