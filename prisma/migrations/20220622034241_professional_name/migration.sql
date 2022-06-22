/*
  Warnings:

  - You are about to drop the `Profesional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProfesionalToRiskFactorGroupData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profesional" DROP CONSTRAINT "Profesional_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Profesional" DROP CONSTRAINT "Profesional_userId_name_fkey";

-- DropForeignKey
ALTER TABLE "_ProfesionalToRiskFactorGroupData" DROP CONSTRAINT "_ProfesionalToRiskFactorGroupData_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfesionalToRiskFactorGroupData" DROP CONSTRAINT "_ProfesionalToRiskFactorGroupData_B_fkey";

-- DropTable
DROP TABLE "Profesional";

-- DropTable
DROP TABLE "_ProfesionalToRiskFactorGroupData";

-- CreateTable
CREATE TABLE "Professional" (
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

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfessionalToRiskFactorGroupData" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Professional_name_userId_key" ON "Professional"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_name_key" ON "Professional"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfessionalToRiskFactorGroupData_AB_unique" ON "_ProfessionalToRiskFactorGroupData"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfessionalToRiskFactorGroupData_B_index" ON "_ProfessionalToRiskFactorGroupData"("B");

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_userId_name_fkey" FOREIGN KEY ("userId", "name") REFERENCES "User"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalToRiskFactorGroupData" ADD FOREIGN KEY ("A") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalToRiskFactorGroupData" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorGroupData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
