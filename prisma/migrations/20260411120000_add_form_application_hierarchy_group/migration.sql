-- CreateTable
CREATE TABLE "FormApplicationHierarchyGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "form_application_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormApplicationHierarchyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormApplicationHierarchyGroupItem" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "hierarchy_id" TEXT NOT NULL,

    CONSTRAINT "FormApplicationHierarchyGroupItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormApplicationHierarchyGroup_form_application_id_idx" ON "FormApplicationHierarchyGroup"("form_application_id");

-- CreateIndex
CREATE UNIQUE INDEX "FormApplicationHierarchyGroupItem_group_id_hierarchy_id_key" ON "FormApplicationHierarchyGroupItem"("group_id", "hierarchy_id");

-- CreateIndex
CREATE INDEX "FormApplicationHierarchyGroupItem_group_id_idx" ON "FormApplicationHierarchyGroupItem"("group_id");

-- CreateIndex
CREATE INDEX "FormApplicationHierarchyGroupItem_hierarchy_id_idx" ON "FormApplicationHierarchyGroupItem"("hierarchy_id");

-- AddForeignKey
ALTER TABLE "FormApplicationHierarchyGroup" ADD CONSTRAINT "FormApplicationHierarchyGroup_form_application_id_fkey" FOREIGN KEY ("form_application_id") REFERENCES "FormApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApplicationHierarchyGroupItem" ADD CONSTRAINT "FormApplicationHierarchyGroupItem_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "FormApplicationHierarchyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
