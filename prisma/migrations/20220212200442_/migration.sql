-- CreateTable
CREATE TABLE "Checklist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistData" (
    "data" JSONB NOT NULL,
    "checklisId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistData_checklisId_key" ON "ChecklistData"("checklisId");

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistData" ADD CONSTRAINT "ChecklistData_checklisId_fkey" FOREIGN KEY ("checklisId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
