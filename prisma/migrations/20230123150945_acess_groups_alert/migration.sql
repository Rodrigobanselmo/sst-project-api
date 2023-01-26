/*
  Warnings:

  - You are about to drop the `_AlertToCompanyGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AlertToCompanyGroup" DROP CONSTRAINT "_AlertToCompanyGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlertToCompanyGroup" DROP CONSTRAINT "_AlertToCompanyGroup_B_fkey";

-- DropTable
DROP TABLE "_AlertToCompanyGroup";

-- CreateTable
CREATE TABLE "_AccessGroupsToAlert" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccessGroupsToAlert_AB_unique" ON "_AccessGroupsToAlert"("A", "B");

-- CreateIndex
CREATE INDEX "_AccessGroupsToAlert_B_index" ON "_AccessGroupsToAlert"("B");

-- AddForeignKey
ALTER TABLE "_AccessGroupsToAlert" ADD CONSTRAINT "_AccessGroupsToAlert_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessGroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccessGroupsToAlert" ADD CONSTRAINT "_AccessGroupsToAlert_B_fkey" FOREIGN KEY ("B") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
