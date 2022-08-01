-- CreateTable
CREATE TABLE "_sub_offices" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_sub_offices_AB_unique" ON "_sub_offices"("A", "B");

-- CreateIndex
CREATE INDEX "_sub_offices_B_index" ON "_sub_offices"("B");

-- AddForeignKey
ALTER TABLE "_sub_offices" ADD CONSTRAINT "_sub_offices_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sub_offices" ADD CONSTRAINT "_sub_offices_B_fkey" FOREIGN KEY ("B") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
