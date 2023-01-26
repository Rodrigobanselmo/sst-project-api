-- CreateEnum
CREATE TYPE "AlertsTypeEnum" AS ENUM ('CLINIC_NEXT_DAY_SCHEDULE', 'COMPANY_EXPIRED_EXAM');

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "type" "AlertsTypeEnum" NOT NULL,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "emails" TEXT[],

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlertToCompanyGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AlertToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Alert_companyId_type_key" ON "Alert"("companyId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Alert_companyId_id_key" ON "Alert"("companyId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "_AlertToCompanyGroup_AB_unique" ON "_AlertToCompanyGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_AlertToCompanyGroup_B_index" ON "_AlertToCompanyGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AlertToUser_AB_unique" ON "_AlertToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AlertToUser_B_index" ON "_AlertToUser"("B");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertToCompanyGroup" ADD CONSTRAINT "_AlertToCompanyGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertToCompanyGroup" ADD CONSTRAINT "_AlertToCompanyGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "CompanyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertToUser" ADD CONSTRAINT "_AlertToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertToUser" ADD CONSTRAINT "_AlertToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
