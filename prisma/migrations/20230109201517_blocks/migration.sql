-- CreateEnum
CREATE TYPE "ScheduleBlockTypeEnum" AS ENUM ('NAT_HOLIDAY', 'MUN_HOLIDAY', 'ST_HOLIDAY', 'OTHER');

-- CreateTable
CREATE TABLE "ScheduleBlock" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "type" "ScheduleBlockTypeEnum",
    "yearRecurrence" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TEXT,
    "endDate" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "allCompanies" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "ScheduleBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_schedule_block_m2m_companies" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "ScheduleBlock_companyId_idx" ON "ScheduleBlock"("companyId");

-- CreateIndex
CREATE INDEX "ScheduleBlock_status_idx" ON "ScheduleBlock"("status");

-- CreateIndex
CREATE INDEX "ScheduleBlock_startDate_idx" ON "ScheduleBlock"("startDate");

-- CreateIndex
CREATE INDEX "ScheduleBlock_endDate_idx" ON "ScheduleBlock"("endDate");

-- CreateIndex
CREATE INDEX "ScheduleBlock_name_idx" ON "ScheduleBlock"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleBlock_id_companyId_key" ON "ScheduleBlock"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "_schedule_block_m2m_companies_AB_unique" ON "_schedule_block_m2m_companies"("A", "B");

-- CreateIndex
CREATE INDEX "_schedule_block_m2m_companies_B_index" ON "_schedule_block_m2m_companies"("B");

-- AddForeignKey
ALTER TABLE "ScheduleBlock" ADD CONSTRAINT "ScheduleBlock_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_schedule_block_m2m_companies" ADD CONSTRAINT "_schedule_block_m2m_companies_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_schedule_block_m2m_companies" ADD CONSTRAINT "_schedule_block_m2m_companies_B_fkey" FOREIGN KEY ("B") REFERENCES "ScheduleBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
