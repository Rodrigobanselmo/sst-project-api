-- CreateTable
CREATE TABLE "_HierarchyToProtocolToRisk" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_HomogeneousGroupToProtocolToRisk" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HierarchyToProtocolToRisk_AB_unique" ON "_HierarchyToProtocolToRisk"("A", "B");

-- CreateIndex
CREATE INDEX "_HierarchyToProtocolToRisk_B_index" ON "_HierarchyToProtocolToRisk"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HomogeneousGroupToProtocolToRisk_AB_unique" ON "_HomogeneousGroupToProtocolToRisk"("A", "B");

-- CreateIndex
CREATE INDEX "_HomogeneousGroupToProtocolToRisk_B_index" ON "_HomogeneousGroupToProtocolToRisk"("B");

-- AddForeignKey
ALTER TABLE "_HierarchyToProtocolToRisk" ADD CONSTRAINT "_HierarchyToProtocolToRisk_A_fkey" FOREIGN KEY ("A") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HierarchyToProtocolToRisk" ADD CONSTRAINT "_HierarchyToProtocolToRisk_B_fkey" FOREIGN KEY ("B") REFERENCES "ProtocolToRisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomogeneousGroupToProtocolToRisk" ADD CONSTRAINT "_HomogeneousGroupToProtocolToRisk_A_fkey" FOREIGN KEY ("A") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomogeneousGroupToProtocolToRisk" ADD CONSTRAINT "_HomogeneousGroupToProtocolToRisk_B_fkey" FOREIGN KEY ("B") REFERENCES "ProtocolToRisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
