/*
  Warnings:

  - You are about to drop the `Proffesional` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Proffesional" DROP CONSTRAINT "Proffesional_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Proffesional" DROP CONSTRAINT "Proffesional_userId_name_fkey";

-- DropTable
DROP TABLE "Proffesional";

-- CreateTable
CREATE TABLE "Profesional" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "formation" TEXT[],
    "certifications" TEXT[],
    "nit" TEXT,
    "crea" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Profesional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfesionalToRiskFactorGroupData" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_name_userId_key" ON "Profesional"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_userId_name_key" ON "Profesional"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfesionalToRiskFactorGroupData_AB_unique" ON "_ProfesionalToRiskFactorGroupData"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfesionalToRiskFactorGroupData_B_index" ON "_ProfesionalToRiskFactorGroupData"("B");

-- AddForeignKey
ALTER TABLE "Profesional" ADD CONSTRAINT "Profesional_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesional" ADD CONSTRAINT "Profesional_userId_name_fkey" FOREIGN KEY ("userId", "name") REFERENCES "User"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfesionalToRiskFactorGroupData" ADD FOREIGN KEY ("A") REFERENCES "Profesional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfesionalToRiskFactorGroupData" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorGroupData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
