-- CreateTable
CREATE TABLE "_HierarchyToHomogeneousGroup" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HierarchyToHomogeneousGroup_AB_unique" ON "_HierarchyToHomogeneousGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_HierarchyToHomogeneousGroup_B_index" ON "_HierarchyToHomogeneousGroup"("B");

-- AddForeignKey
ALTER TABLE "_HierarchyToHomogeneousGroup" ADD FOREIGN KEY ("A") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HierarchyToHomogeneousGroup" ADD FOREIGN KEY ("B") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
