-- CreateTable
CREATE TABLE "ExamToClinic" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "dueInDays" INTEGER,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "observation" TEXT,

    CONSTRAINT "ExamToClinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamToClinicPricing" (
    "id" SERIAL NOT NULL,
    "examToClinicId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observation" TEXT,

    CONSTRAINT "ExamToClinicPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamToClinicSchedule" (
    "id" SERIAL NOT NULL,
    "examToClinicId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "observation" TEXT,

    CONSTRAINT "ExamToClinicSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamToClinic_examId_companyId_key" ON "ExamToClinic"("examId", "companyId");

-- AddForeignKey
ALTER TABLE "ExamToClinic" ADD CONSTRAINT "ExamToClinic_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToClinic" ADD CONSTRAINT "ExamToClinic_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToClinicPricing" ADD CONSTRAINT "ExamToClinicPricing_examToClinicId_fkey" FOREIGN KEY ("examToClinicId") REFERENCES "ExamToClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamToClinicSchedule" ADD CONSTRAINT "ExamToClinicSchedule_examToClinicId_fkey" FOREIGN KEY ("examToClinicId") REFERENCES "ExamToClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
