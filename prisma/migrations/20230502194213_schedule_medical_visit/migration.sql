-- AlterTable
ALTER TABLE "EmployeeExamsHistory" ADD COLUMN     "scheduleMedicalVisitId" INTEGER;

-- CreateTable
CREATE TABLE "ScheduleMedicalVisit" (
    "id" SERIAL NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "doneClinicDate" TIMESTAMP(3),
    "doneLabDate" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "clinicId" TEXT,
    "labId" TEXT,
    "docId" INTEGER,

    CONSTRAINT "ScheduleMedicalVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduleMedicalVisit_companyId_idx" ON "ScheduleMedicalVisit"("companyId");

-- CreateIndex
CREATE INDEX "ScheduleMedicalVisit_status_idx" ON "ScheduleMedicalVisit"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleMedicalVisit_id_companyId_key" ON "ScheduleMedicalVisit"("id", "companyId");

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_scheduleMedicalVisitId_fkey" FOREIGN KEY ("scheduleMedicalVisitId") REFERENCES "ScheduleMedicalVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMedicalVisit" ADD CONSTRAINT "ScheduleMedicalVisit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMedicalVisit" ADD CONSTRAINT "ScheduleMedicalVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMedicalVisit" ADD CONSTRAINT "ScheduleMedicalVisit_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMedicalVisit" ADD CONSTRAINT "ScheduleMedicalVisit_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMedicalVisit" ADD CONSTRAINT "ScheduleMedicalVisit_docId_fkey" FOREIGN KEY ("docId") REFERENCES "ProfessionalCouncil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
